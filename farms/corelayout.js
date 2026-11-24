// Farms CHART tab layout for the core farms: few big boxes, straight lines. Pure (no DOM; Node checks use it).
// Columns: the milestone bands left to right; inside a band a box may take any column that keeps its in-band
// links pointing right. A seeded local search picks each box's column and row so that the lines cross
// nothing (no other line, no other box), stay as flat as they can, follow Tim's build order (`rank`) left to
// right inside a band, and the chart keeps a laptop screen's shape (so it can be drawn big). Each line is one
// straight segment (0 bends) from the right side of the box you build first to the left side of the farm
// that needs it. Each column is only as wide as its widest box (a 3x box widens only its own column), the
// gap inside a band is shorter than the gap at a milestone line.

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
// o: boxW (narrowest box), boxH, rowH, gapIn (between columns of one band), gapBand (across a milestone line),
//    pad, margin (clear space a line keeps from other boxes), widthOf(id), rankOf(id) (build order, low first),
//    aspect (the width/height the chart aims for: a laptop chart area), seed, restarts, maxEvals
export function coreLayout(nodes, edges, bandOf, o = {}) {
  const boxW = o.boxW ?? 64, boxH = o.boxH ?? 64, rowH = o.rowH ?? 100, pad = o.pad ?? 20;
  const gapIn = o.gapIn ?? o.gapX ?? 80, gapBand = o.gapBand ?? o.gapX ?? 100;
  const margin = o.margin ?? 10, widthOf = o.widthOf ?? (() => boxW), aspect = o.aspect ?? 1.8;
  const ids = nodes.map((n) => n.id), N = ids.length, idx = new Map(ids.map((id, i) => [id, i]));
  edges = edges.filter((e) => idx.has(e.from) && idx.has(e.to) && e.from !== e.to);
  const E = edges.map((e) => [idx.get(e.from), idx.get(e.to)]);
  const band = ids.map((id) => bandOf.get(id) ?? 0);
  const rank = ids.map((id) => +(o.rankOf ? o.rankOf(id) : 0) || 0);
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
  const bandOfCol = new Array(columns).fill(0);
  bands.forEach((b, i) => { for (let c = b.start; c <= b.end; c++) bandOfCol[c] = i; });
  const bw = ids.map(widthOf);
  const tall = Math.max(1, ...bands.map((b, i) => Math.ceil(ids.filter((_, k) => band[k] === i).length / Math.max(1, b.end - b.start + 1))));

  // column x from the boxes now in each column (a wide box widens only its own column)
  const xs = new Array(columns + 1), cw = new Array(columns);
  const placeCols = (cl) => {
    cw.fill(boxW);
    for (let k = 0; k < N; k++) if (bw[k] > cw[cl[k]]) cw[cl[k]] = bw[k];
    xs[0] = pad;
    for (let c = 0; c < columns; c++) xs[c + 1] = xs[c] + cw[c] + (c + 1 < columns && bandOfCol[c + 1] !== bandOfCol[c] ? gapBand : gapIn);
    return xs[columns] - gapIn + pad; // the chart's width
  };
  // how many rows fit under that width at the laptop's shape; more costs zoom (smaller boxes)
  const rowsFit = (W) => Math.max(1, Math.floor((W / aspect - 2 * pad - boxH) / rowH) + 1);

  // cost of a placement: lines crossing lines or boxes first, then climb, then build order, then height.
  // The line ends are spread on the box sides exactly as they are drawn (see finish), so the search judges
  // the real drawing.
  const col = new Array(N), row = new Array(N);
  const outsOf = ids.map((_, k) => E.map((e, i) => i).filter((i) => E[i][0] === k));
  const insOf = ids.map((_, k) => E.map((e, i) => i).filter((i) => E[i][1] === k));
  const spreadStep = (n) => (n > 1 ? Math.min(12, (boxH - 20) / (n - 1)) : 0);
  const X1 = new Array(E.length), Y1 = new Array(E.length), X2 = new Array(E.length), Y2 = new Array(E.length);
  const sl = new Array(E.length);
  const samePairs = [];
  for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) if (a !== b && band[a] === band[b] && rank[a] < rank[b]) samePairs.push([a, b]);
  let evals = 0;
  const score = () => {
    evals++;
    const W = placeCols(col);
    let bad = 0, climb = 0, order = 0, rmin = Infinity, rmax = -Infinity;
    for (let k = 0; k < N; k++) { if (row[k] < rmin) rmin = row[k]; if (row[k] > rmax) rmax = row[k]; }
    for (let i = 0; i < E.length; i++) {
      const [f, t] = E[i];
      X1[i] = xs[col[f]] + bw[f]; Y1[i] = row[f] * rowH; X2[i] = xs[col[t]]; Y2[i] = row[t] * rowH;
      sl[i] = (Y2[i] - Y1[i]) / Math.max(1, X2[i] - X1[i]);
      climb += Math.abs(Y2[i] - Y1[i]) / rowH + (col[t] - col[f] - 1) * 0.3; // long lines cost a little too
    }
    for (const [a, b] of samePairs) if (col[a] > col[b]) order++; // later build to the left of an earlier one
    for (let k = 0; k < N; k++) {
      const os = outsOf[k], is = insOf[k];
      if (os.length > 1) { const s = os.slice().sort((a, b) => sl[a] - sl[b]), st = spreadStep(s.length); s.forEach((i, n) => { Y1[i] += (n - (s.length - 1) / 2) * st; }); }
      if (is.length > 1) { const s = is.slice().sort((a, b) => sl[b] - sl[a]), st = spreadStep(s.length); s.forEach((i, n) => { Y2[i] += (n - (s.length - 1) / 2) * st; }); }
    }
    for (let i = 0; i < E.length; i++) {
      const [f, t] = E[i];
      for (let j = i + 1; j < E.length; j++) if (crosses(X1[i], Y1[i], X2[i], Y2[i], X1[j], Y1[j], X2[j], Y2[j])) bad++;
      for (let k = 0; k < N; k++) {
        if (k === f || k === t || xs[col[k]] >= X2[i] || xs[col[k]] + bw[k] <= X1[i]) continue;
        const rx = xs[col[k]] - margin, ry = row[k] * rowH - boxH / 2 - margin;
        if (hitsRect(X1[i], Y1[i], X2[i], Y2[i], rx, ry, bw[k] + 2 * margin, boxH + 2 * margin)) bad++;
      }
    }
    const rows = rmax - rmin + 1, over = Math.max(0, rows - rowsFit(W));
    return bad * 1000 + climb * 10 + order * 12 + over * 150 + rows * 2;
  };
  const taken = (c, r, except) => { for (let k = 0; k < N; k++) if (k !== except && col[k] === c && row[k] === r) return k; return -1; };
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
    const width = placeCols(pl.col), X = xs.slice();
    const rmin = Math.min(...pl.row), rowsUsed = Math.max(...pl.row) - rmin + 1;
    const boxes = new Map(ids.map((id, i) => [id, { x: X[pl.col[i]], y: pad + (pl.row[i] - rmin) * rowH, w: bw[i], h: boxH, col: pl.col[i] }]));
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
    let order = 0;
    for (const [a, b] of samePairs) if (pl.col[a] > pl.col[b]) order++;
    // each milestone line: in the middle of the gap before its band's first column
    const lineX = bands.slice(1).map((b) => (b.start > 0 ? X[b.start] - gapBand / 2 : pad / 2));
    return { boxes, out, rowsUsed, crossings, boxHits, order, width, X, lineX };
  };

  const rand = rng(o.seed ?? 8), budget = o.maxEvals ?? 80000; // (a time cap: about 1 s on a laptop)
  let best = null, bestS = Infinity;
  // rows to work with: a little more than the fullest column needs (room for lines to pass between boxes)
  for (let R = tall + (o.extraRows ?? 4); R <= tall + 5 && bestS >= 1000; R++) {
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
        if (s < 1000 && kick >= (o.cleanKicks ?? 6)) break; // clean: a few more shakes for flatter lines, then stop
      }
      const pl = { col: col.slice(), row: row.slice() }, fin = finish(pl);
      s += 1000 * (fin.crossings + fin.boxHits); // judged on the lines as drawn
      if (s < bestS) { bestS = s; best = pl; }
      if (bestS < 1000 && restart + 1 >= (o.cleanTries ?? 2)) break; // clean already
    }
  }
  if (!best) best = { col: lo.slice(), row: lo.map((c, i) => i) };
  const { boxes, out, rowsUsed, crossings, boxHits, order, width, X, lineX } = finish(best);
  const height = pad * 2 + (rowsUsed - 1) * rowH + boxH;
  const colX = (c) => X[c];
  return { boxes, edges: out, width, height, columns, bands, colX, lineX, stats: { crossings, boxHits, bends: 0, straight: out.filter((e) => Math.abs(e.pts[0][1] - e.pts[1][1]) < 0.5).length, rows: rowsUsed, orderSwaps: order, evals } };
}
