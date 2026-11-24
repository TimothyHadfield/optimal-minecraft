// Farms CHART tab layout for the core farms: few big boxes, straight lines. Pure (no DOM; Node checks use it).
// Columns: the milestone bands left to right; inside a band a box may take any column that keeps its in-band
// links pointing right. A seeded local search picks each box's column and row so that the lines cross
// nothing (no other line, no other box), stay as flat as they can, and the chart stays short. Each line is
// one straight segment (0 bends) from the right side of the box you build first to the left side of the farm
// that needs it.

function rng(seed) { // mulberry32
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const side = (ax, ay, bx, by, cx, cy) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
// do segments (x1,y1)-(x2,y2) and (x3,y3)-(x4,y4) properly cross (touching ends don't count)
export function crosses(x1, y1, x2, y2, x3, y3, x4, y4) {
  const d1 = side(x3, y3, x4, y4, x1, y1), d2 = side(x3, y3, x4, y4, x2, y2);
  if (!((d1 > 1e-9 && d2 < -1e-9) || (d1 < -1e-9 && d2 > 1e-9))) return false;
  const d3 = side(x1, y1, x2, y2, x3, y3), d4 = side(x1, y1, x2, y2, x4, y4);
  return (d3 > 1e-9 && d4 < -1e-9) || (d3 < -1e-9 && d4 > 1e-9);
}
// does the segment pass through the open rectangle (Liang-Barsky clip)
export function hitsRect(x1, y1, x2, y2, rx, ry, rw, rh) {
  let t0 = 0, t1 = 1;
  const dx = x2 - x1, dy = y2 - y1;
  for (let s = 0; s < 4; s++) {
    const p = s === 0 ? -dx : s === 1 ? dx : s === 2 ? -dy : dy, q = s === 0 ? x1 - rx : s === 1 ? rx + rw - x1 : s === 2 ? y1 - ry : ry + rh - y1;
    if (Math.abs(p) < 1e-12) { if (q <= 0) return false; continue; }
    const r = q / p;
    if (p < 0) { if (r > t0) t0 = r; } else if (r < t1) t1 = r;
    if (t0 >= t1) return false;
  }
  return t1 - t0 > 1e-9;
}

// nodes [{id}], edges [{from, to, rating}], bandOf Map id -> band number.
// o: boxW, boxH, rowH, gapX, pad, margin (clear space a line keeps from other boxes), widthOf(id), seed,
//    iters, restarts
export function coreLayout(nodes, edges, bandOf, o = {}) {
  const boxW = o.boxW ?? 64, boxH = o.boxH ?? 64, rowH = o.rowH ?? 104, gapX = o.gapX ?? 150, pad = o.pad ?? 20;
  const margin = o.margin ?? 10, widthOf = o.widthOf ?? (() => boxW);
  const ids = nodes.map((n) => n.id), N = ids.length, idx = new Map(ids.map((id, i) => [id, i]));
  edges = edges.filter((e) => idx.has(e.from) && idx.has(e.to) && e.from !== e.to);
  const E = edges.map((e) => [idx.get(e.from), idx.get(e.to)]);
  const band = ids.map((id) => bandOf.get(id) ?? 0);
  const inBand = E.filter(([f, t]) => band[f] === band[t]);
  // longest in-band chain before (dn) and after (up) each box; capped so a loop can't run away
  const dn = new Array(N).fill(0), up = new Array(N).fill(0);
  for (let it = 0; it < N; it++) for (const [f, t] of inBand) { dn[t] = Math.min(N, Math.max(dn[t], dn[f] + 1)); up[f] = Math.min(N, Math.max(up[f], up[t] + 1)); }
  const nb = Math.max(0, ...band) + 1, bands = [];
  for (let b = 0, start = 0; b < nb; b++) {
    const mine = ids.map((_, i) => i).filter((i) => band[i] === b);
    // a band with many boxes and short chains gets more columns (at most maxPerCol boxes per column)
    const w = mine.length ? Math.max(Math.max(...mine.map((i) => dn[i] + up[i])) + 1, Math.ceil(mine.length / (o.maxPerCol ?? 4))) : 0;
    bands.push({ start, end: start + w - 1 }); start += w;
  }
  const lo = ids.map((_, i) => bands[band[i]].start + dn[i]), hi = ids.map((_, i) => bands[band[i]].end - up[i]);
  const columns = Math.max(1, ...hi.map((h) => h + 1));
  const colX = (c) => pad + c * (boxW + gapX);
  const bw = ids.map(widthOf);
  const tall = Math.max(1, ...bands.map((b, i) => Math.ceil(ids.filter((_, k) => band[k] === i).length / Math.max(1, b.end - b.start + 1))));

  // cost of a placement: lines crossing lines or boxes first, then climb, then height. The line ends are
  // spread on the box sides exactly as they are drawn (see finish), so the search judges the real drawing.
  const col = new Array(N), row = new Array(N);
  const outsOf = ids.map((_, k) => E.map((e, i) => i).filter((i) => E[i][0] === k));
  const insOf = ids.map((_, k) => E.map((e, i) => i).filter((i) => E[i][1] === k));
  const spreadStep = (n) => (n > 1 ? Math.min(12, (boxH - 20) / (n - 1)) : 0);
  const X1 = new Array(E.length), Y1 = new Array(E.length), X2 = new Array(E.length), Y2 = new Array(E.length);
  const sl = new Array(E.length);
  let evals = 0;
  const score = () => {
    evals++;
    let bad = 0, climb = 0, rmin = Infinity, rmax = -Infinity;
    for (let k = 0; k < N; k++) { if (row[k] < rmin) rmin = row[k]; if (row[k] > rmax) rmax = row[k]; }
    for (let i = 0; i < E.length; i++) {
      const [f, t] = E[i];
      X1[i] = colX(col[f]) + bw[f]; Y1[i] = row[f] * rowH; X2[i] = colX(col[t]); Y2[i] = row[t] * rowH;
      sl[i] = (Y2[i] - Y1[i]) / Math.max(1, X2[i] - X1[i]);
      climb += Math.abs(Y2[i] - Y1[i]) / rowH + (col[t] - col[f] - 1) * 0.5; // long lines cost a little too
    }
    for (let k = 0; k < N; k++) {
      const os = outsOf[k], is = insOf[k];
      if (os.length > 1) { const s = os.slice().sort((a, b) => sl[a] - sl[b]), st = spreadStep(s.length); s.forEach((i, n) => { Y1[i] += (n - (s.length - 1) / 2) * st; }); }
      if (is.length > 1) { const s = is.slice().sort((a, b) => sl[b] - sl[a]), st = spreadStep(s.length); s.forEach((i, n) => { Y2[i] += (n - (s.length - 1) / 2) * st; }); }
    }
    for (let i = 0; i < E.length; i++) {
      const [f, t] = E[i];
      for (let j = i + 1; j < E.length; j++) if (crosses(X1[i], Y1[i], X2[i], Y2[i], X1[j], Y1[j], X2[j], Y2[j])) bad++;
      for (let k = 0; k < N; k++) {
        if (k === f || k === t || col[k] <= col[f] || col[k] >= col[t]) continue;
        const rx = colX(col[k]) - margin, ry = row[k] * rowH - boxH / 2 - margin;
        if (hitsRect(X1[i], Y1[i], X2[i], Y2[i], rx, ry, bw[k] + 2 * margin, boxH + 2 * margin)) bad++;
      }
    }
    return bad * 1000 + climb * 10 + (rmax - rmin) * 6;
  };  const taken = (c, r, except) => { for (let k = 0; k < N; k++) if (k !== except && col[k] === c && row[k] === r) return k; return -1; };
  const okCol = (k, c) => inBand.every(([f, t]) => (f === k ? c : col[f]) < (t === k ? c : col[t]));

  // move box k to (c, r); a box already there swaps into k's old spot (if it may). Returns an undo, or null.
  const move = (k, c, r) => {
    const oc = col[k], orw = row[k];
    if ((c === oc && r === orw) || !okCol(k, c)) return null;
    const other = taken(c, r, k);
    if (other >= 0 && c !== oc && (oc < lo[other] || oc > hi[other])) return null;
    col[k] = c; row[k] = r;
    if (other >= 0) { col[other] = oc; row[other] = orw; if (!okCol(other, oc)) { col[other] = c; row[other] = r; col[k] = oc; row[k] = orw; return null; } }
    return () => { if (other >= 0) { col[other] = c; row[other] = r; } col[k] = oc; row[k] = orw; };
  };
  // best single move for each box in turn, until nothing improves
  const descend = (R) => {
    let s = score();
    for (let pass = 0, better = true; better && pass < 30; pass++) {
      better = false;
      for (let k = 0; k < N; k++) {
        let bs = s, bm = null;
        for (let c = lo[k]; c <= hi[k]; c++) for (let r = 0; r < R; r++) {
          const undo = move(k, c, r); if (!undo) continue;
          const s2 = score(); undo();
          if (s2 < bs - 1e-9) { bs = s2; bm = [c, r]; }
        }
        if (bm) { move(k, bm[0], bm[1]); s = bs; better = true; }
      }
    }
    return s;
  };
  // a placement -> boxes and the drawn lines: the ends spread along each box side, sorted by direction so
  // one box's lines don't cross; counts crossings and box hits on the lines as drawn
  const finish = (pl) => {
    const rmin = Math.min(...pl.row), rowsUsed = Math.max(...pl.row) - rmin + 1;
    const boxes = new Map(ids.map((id, i) => [id, { x: colX(pl.col[i]), y: pad + (pl.row[i] - rmin) * rowH, w: bw[i], h: boxH, col: pl.col[i] }]));
    const L = edges.map((e) => ({ ...e, s: boxes.get(e.from), t: boxes.get(e.to), so: 0, ti: 0 }));
    const slope = (l) => (l.t.y - l.s.y) / Math.max(1, l.t.x - l.s.x - l.s.w);
    const spread = (list, key) => { const n = list.length, step = n > 1 ? Math.min(12, (boxH - 20) / (n - 1)) : 0; list.forEach((l, i) => { l[key] = (i - (n - 1) / 2) * step; }); };
    for (const id of ids) {
      spread(L.filter((l) => l.from === id).sort((a, b) => slope(a) - slope(b)), 'so');
      spread(L.filter((l) => l.to === id).sort((a, b) => slope(b) - slope(a)), 'ti');
    }
    const out = L.map((l) => ({ from: l.from, to: l.to, rating: l.rating, pts: [[l.s.x + l.s.w, l.s.y + boxH / 2 + l.so], [l.t.x, l.t.y + boxH / 2 + l.ti]] }));
    let crossings = 0, boxHits = 0;
    for (let i = 0; i < out.length; i++) {
      const [[a, b], [c, d]] = out[i].pts;
      for (let j = i + 1; j < out.length; j++) { const [[e, f], [g, h]] = out[j].pts; if (crosses(a, b, c, d, e, f, g, h)) crossings++; }
      for (const [id, r] of boxes) if (id !== out[i].from && id !== out[i].to && hitsRect(a, b, c, d, r.x - 2, r.y - 2, r.w + 4, r.h + 4)) boxHits++;
    }
    return { boxes, out, rowsUsed, crossings, boxHits };
  };

  const rand = rng(o.seed ?? 8), budget = o.maxEvals ?? 40000; // (a time cap: about 1 s on a laptop)
  let best = null, bestS = Infinity;
  // rows to work with: a little more than the fullest column needs (room for lines to pass between boxes)
  for (let R = tall + (o.extraRows ?? 2); R <= tall + 4 && bestS >= 1000; R++) {
    for (let restart = 0; restart < (o.restarts ?? 6) && evals < budget; restart++) {
      // start: each box in the first free column it may take, random order
      const fill = new Array(columns).fill(0);
      const order = ids.map((_, i) => i);
      for (let i = N - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } // (same in every browser)
      col.fill(undefined);
      const fits = (k, c) => inBand.every(([f, t]) => { const a = f === k ? c : col[f], b = t === k ? c : col[t]; return a === undefined || b === undefined || a < b; });
      for (const k of order) {
        let c = lo[k];
        for (let x = lo[k]; x <= hi[k]; x++) if (fill[x] < R && fits(k, x)) { c = x; break; }
        col[k] = c; row[k] = fill[c]++;
      }
      let s = descend(R);
      // shake a few boxes and descend again; keep it if better
      for (let kick = 0; kick < (o.kicks ?? 15) && evals < budget; kick++) {
        const saved = { col: col.slice(), row: row.slice() };
        for (let m = 0; m < 3; m++) { const k = Math.floor(rand() * N); move(k, lo[k] + Math.floor(rand() * (hi[k] - lo[k] + 1)), Math.floor(rand() * R)); }
        const s2 = descend(R);
        if (s2 < s) s = s2; else { saved.col.forEach((v, i) => { col[i] = v; }); saved.row.forEach((v, i) => { row[i] = v; }); }
        if (s < 1000 && kick >= (o.cleanKicks ?? 4)) break; // clean: a few more shakes for flatter lines, then stop
      }
      const pl = { col: col.slice(), row: row.slice() }, fin = finish(pl);
      s += 1000 * (fin.crossings + fin.boxHits); // judged on the lines as drawn
      if (s < bestS) { bestS = s; best = pl; }
      if (bestS < 1000 && restart + 1 >= (o.cleanTries ?? 1)) break; // clean already
    }
  }
  if (!best) best = { col: lo.slice(), row: lo.map((c, i) => i) };
  const { boxes, out, rowsUsed, crossings, boxHits } = finish(best);
  const width = colX(columns - 1) + boxW + pad, height = pad * 2 + (rowsUsed - 1) * rowH + boxH;
  return { boxes, edges: out, width, height, columns, bands, colX, stats: { crossings, boxHits, bends: 0, straight: out.filter((e) => Math.abs(e.pts[0][1] - e.pts[1][1]) < 0.5).length, rows: rowsUsed, evals } };
}