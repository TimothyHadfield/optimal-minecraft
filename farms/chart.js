// Farms CHART tab: the core farms only (plan `core: true`) as big icon boxes, every prereq link rated 2-5
// between them (red -> green, 5 thicker), and a full-height line for each milestone (anything right of a
// line needs that milestone). Tricks and non-core farms are not on it (Tim, 2026-11-24).
// Uses the globals of index.html's main script (PLAN, MILESTONES, FARMS, TRICKS, byKey, nameOf, icon, chip,
// stageOf, shortOf, dots, esc, num, itemId, MODE, openEntry). Layout: corelayout.js (straight lines, no crossings).
import { coreLayout } from './corelayout.js';
import { buildGraph, SIZES, RATING_COLOR, multiples, boxWidth, coreEntries, usedMilestones, CORE_MIN_RATING } from './chartgraph.js';

const HEAD = 30; // the milestone labels' row (sticky at the top of the chart)
const ZMIN = 0.35, ZMAX = 2, ZSTEP = 1.2;
const HOVER = matchMedia('(hover: hover) and (pointer: fine)').matches;
const WIDE_C = () => matchMedia('(min-width: 900px)').matches;
let CH = null, CH_SIG = '', Z = 1, CARD = null;

const css = `
#chart { margin: 8px calc(50% - 50vw + 10px) 0; position: relative; }
#chart .cv { overflow: auto; background: #1a1410; border: 2px solid #0a0805; box-shadow: inset 2px 2px 0 rgba(0,0,0,0.5); overscroll-behavior: contain; cursor: grab; }
#chart .cv.drag { cursor: grabbing; user-select: none; }
#chart .mhead { position: sticky; top: 0; z-index: 3; height: ${HEAD}px; pointer-events: none; }
#chart .ml { position: absolute; top: 4px; transform: translateX(-50%); display: flex; align-items: center; gap: 4px; padding: 1px 6px 1px 3px; background: #1a1410; border: 2px solid #ffd54a; color: #ffd54a; font-size: 14px; white-space: nowrap; }
#chart .csz { position: relative; }
#chart .cin { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
#chart svg { position: absolute; left: 0; top: 0; overflow: visible; }
#chart .bt0 { fill: rgba(124,194,66,0.05); } #chart .bt1 { fill: rgba(240,168,48,0.06); }
#chart .mline { stroke: #ffd54a; stroke-width: 2; opacity: .75; }
#chart .eg path { fill: none; stroke-width: 2.2; opacity: .9; }
#chart .eg path.hi { stroke-width: 4; }
#chart .eg path.hl { opacity: 1; }
#chart .eg.hov path:not(.hl) { opacity: .12; }
#chart .lg { position: absolute; left: 8px; bottom: 8px; z-index: 4; display: flex; gap: 6px; padding: 1px 5px; background: #1a1410; border: 2px solid #0a0805; font-size: 12px; color: #a89880; pointer-events: none; }
#chart .lg span { display: inline-flex; align-items: center; gap: 3px; }
#chart .lg i { display: inline-block; width: 12px; height: 3px; }
#chart .bx { all: unset; position: absolute; box-sizing: border-box; display: flex; align-items: center; justify-content: center; background: #2a221c; border: 2px solid #0a0805; box-shadow: inset 2px 2px 0 rgba(255,255,255,0.06), inset -2px -2px 0 rgba(0,0,0,0.4); cursor: pointer; }
#chart .bx:hover, #chart .bx.on { border-color: #ffd54a; }
#chart .bx img { width: 40px; height: 40px; image-rendering: pixelated; }
#chart .bx img + img { margin-left: -16px; }
#chart .zm { position: absolute; right: 8px; bottom: 8px; z-index: 4; display: flex; gap: 4px; }
#chart .zm button { width: 36px; height: 36px; padding: 0; border: 2px solid #0a0805; background: #1f1813; color: #f4ead5; font-size: 18px; cursor: pointer; box-shadow: inset 2px 2px 0 rgba(255,255,255,0.1), inset -2px -2px 0 rgba(0,0,0,0.3); }
#chart .card2 { position: absolute; z-index: 5; width: 236px; background: #2a221c; border: 2px solid #0a0805; box-shadow: 3px 3px 0 rgba(0,0,0,0.5); padding: 7px 8px 8px; }
#chart .card2[hidden] { display: none; }
#chart .card2 .hd { display: flex; align-items: center; gap: 6px; }
#chart .card2 .hd b { flex: 1; min-width: 0; font-weight: normal; color: #ffd54a; line-height: 1; }
#chart .card2 .one { font-size: 14px; margin-top: 3px; }
#chart .card2 h3 { margin: 6px 0 3px; }
#chart .card2 .it { font-size: 13px; }
#chart .card2 .bf { display: flex; flex-wrap: wrap; gap: 3px 8px; }
#chart .card2 .bf span { display: inline-flex; align-items: center; gap: 3px; }
#chart .card2 .dots { font-size: 12px; }
#chart .card2 .go { all: unset; cursor: pointer; display: block; box-sizing: border-box; width: 100%; margin-top: 7px; text-align: center; padding: 6px 0; font-family: "Pixelify Sans", monospace; font-size: 13px; background: #8b6f47; border: 2px solid #0a0805; }
#chart .empty { padding: 20px; }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

// ---- layout (once per plan) ----
function compute() {
  const t0 = performance.now();
  const entries = Object.fromEntries(Object.entries(coreEntries(PLAN)).filter(([k]) => byKey(k)));
  const G = buildGraph({ milestones: usedMilestones(MILESTONES, entries), entries }, { reduce: false, minRating: CORE_MIN_RATING });
  const rateOf = (k) => {
    const e = byKey(k), ic = itemId(entries[k].icon);
    const outs = (e.outputs || []).filter((o) => o.rate_per_hour != null);
    const o = outs.find((x) => itemId(x.item) === ic);
    return +(o ? o.rate_per_hour : Math.max(0, ...outs.map((x) => +x.rate_per_hour || 0))) || 0;
  };
  const mult = multiples(entries, rateOf); // 1x / 2x / 3x within the core set
  const boxW = boxWidth(Math.max(1, ...mult.values()));
  const C = coreLayout(G.nodes, G.edges, G.bandOf, { ...SIZES, boxW, widthOf: (k) => boxWidth(mult.get(k) || 1) });
  // each milestone line: in the middle of the gap before its band's first column
  const lines = C.bands.slice(1).map((b, i) => ({ x: b.start > 0 ? C.colX(b.start) - SIZES.gapX / 2 : SIZES.pad / 2, m: G.milestones[i] }));
  const rating = new Map(G.edges.map((e) => [e.from + '>' + e.to, e.rating]));
  window.CHART_STATS = { nodes: G.nodes.length, edges: G.edges.length, drawn: C.edges.length, ...C.stats, columns: C.columns, width: Math.round(C.width), height: Math.round(C.height), ms: Math.round(performance.now() - t0) };
  return { G, C, lines, rating, mult, entries };
}
const d = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('');

function paint(el) {
  const { C, lines, rating, mult } = CH;
  const W = C.width, H = C.height;
  let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>` + [1, 2, 3, 4, 5].map((r) =>
    `<marker id="cah${r}" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="${r >= 5 ? 12 : 10}" markerHeight="${r >= 5 ? 12 : 10}" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0L6,3L0,6z" fill="${RATING_COLOR[r]}"/></marker>`).join('') + '</defs>';
  const xs = [0, ...lines.map((l) => l.x), W];
  for (let k = 0; k + 1 < xs.length; k++) svg += `<rect class="bt${k % 2}" x="${xs[k]}" y="0" width="${xs[k + 1] - xs[k]}" height="${H}"/>`;
  svg += lines.map((l) => `<line class="mline" x1="${l.x}" x2="${l.x}" y1="0" y2="${H}"/>`).join('');
  svg += '<g class="eg">' + C.edges.map((e) => {
    const r = Math.max(1, Math.min(5, rating.get(e.from + '>' + e.to) || 3)); // red (low) -> green (high); 5 also thicker
    return `<path data-f="${esc(e.from)}" data-t="${esc(e.to)}"${r >= 5 ? ' class="hi"' : ''} style="stroke:${RATING_COLOR[r]}" marker-end="url(#cah${r})" d="${d(e.pts)}"/>`;
  }).join('') + '</g></svg>';
  let boxes = '';
  for (const [id, b] of C.boxes) {
    const e = byKey(id), n = mult.get(id) || 1;
    boxes += `<button class="bx" data-k="${esc(id)}" aria-label="${esc(nameOf(e))}" style="left:${b.x}px;top:${b.y}px;width:${boxWidth(n)}px;height:${b.h}px">${icon(iconOf(e)).repeat(n)}</button>`;
  }
  const legend = `<div class="lg">${[2, 3, 4, 5].map((r) => `<span><i style="background:${RATING_COLOR[r]}"></i>${r}</span>`).join('')}</div>`;
  el.innerHTML = `<div class="cv"><div class="mhead"></div><div class="csz"><div class="cin" style="width:${W}px;height:${H}px">${svg}${boxes}</div></div></div>
    ${legend}<div class="zm"><button data-z="-1" aria-label="Zoom out">−</button><button data-z="1" aria-label="Zoom in">+</button></div>
    <div class="card2" hidden></div>`;
  wire(el);
}

// laptop: the whole chart fits the box (no pan); phone: as tall as the box allows, pan sideways
function fitZoom(el) {
  const cv = el.querySelector('.cv'), { C } = CH;
  const zh = (cv.clientHeight - HEAD - 6) / C.height, zw = (cv.clientWidth - 6) / C.width;
  Z = WIDE_C() ? Math.min(1.4, zh, zw) : Math.max(0.55, Math.min(1, zh));
  if (WIDE_C()) cv.style.height = Math.min(cv.clientHeight, Math.ceil(C.height * Z + HEAD + 8)) + 'px'; // no empty strip under it
}

function zoom(el, keepCenter) {
  const z = Z, cv = el.querySelector('.cv'), { C, lines } = CH;
  let cx = 0, cy = 0;
  if (keepCenter) { const oz = +cv.dataset.z || z; cx = (cv.scrollLeft + cv.clientWidth / 2) / oz; cy = (cv.scrollTop + cv.clientHeight / 2) / oz; }
  cv.dataset.z = z;
  el.querySelector('.cin').style.transform = `scale(${z})`;
  const sz = el.querySelector('.csz');
  sz.style.width = C.width * z + 'px'; sz.style.height = C.height * z + 'px';
  const head = el.querySelector('.mhead');
  head.style.width = C.width * z + 'px';
  head.innerHTML = lines.map((l) => l.m ? `<span class="ml" style="left:${(l.x * z).toFixed(1)}px">${icon(l.m.icon)}${esc(l.m.name)}</span>` : '').join('');
  // a label that would cover the one before it drops to a second row
  let lastR = -Infinity, rows = 1;
  head.querySelectorAll('.ml').forEach((s) => {
    const w = s.offsetWidth, x = parseFloat(s.style.left) - w / 2;
    if (x < lastR + 4) { s.style.top = HEAD - 2 + 'px'; rows = 2; lastR = -Infinity; } else lastR = x + w;
  });
  head.style.height = HEAD * rows + 'px';
  if (keepCenter) { cv.scrollLeft = cx * z - cv.clientWidth / 2; cv.scrollTop = cy * z - cv.clientHeight / 2; }
}

function cardHtml(k) {
  const e = byKey(k), p = plan(e), st = stageOf(e);
  let h = `<div class="hd">${icon(iconOf(e), 'l')}<b>${esc(nameOf(e))}</b><span class="chip-st st-${st}">${st}</span></div>`;
  if (shortOf(e)) h += `<div class="one">${esc(shortOf(e))}</div>`;
  if (e.n != null) {
    const outs = (e.outputs || []).filter((o) => itemId(o.item)).slice(0, 3);
    if (outs.length) h += `<h3>MAKES</h3><div class="chips">${outs.map((o) => chip(o.item, o.rate_per_hour != null ? num(o.rate_per_hour) + '/h' : '')).join('')}</div>`;
  }
  const pre = (p.prereqs || []).filter((r) => byKey(r.ref)).sort((a, b) => b.rating - a.rating).slice(0, 4);
  if (pre.length) h += `<h3>BUILD FIRST</h3><div class="bf">${pre.map((r) => { const t = byKey(r.ref); return `<span title="${esc(nameOf(t))}">${icon(iconOf(t))}${dots(r.rating)}</span>`; }).join('')}</div>`;
  return h + `<button class="go" data-open="${esc(k)}">OPEN ▶</button>`;
}

// the pointed-at box: its own lines stay bright, every other line dims
function showCard(el, b) {
  const card = el.querySelector('.card2'), k = b.dataset.k;
  CARD = k;
  el.querySelectorAll('.bx.on').forEach((x) => x.classList.remove('on'));
  b.classList.add('on');
  const eg = el.querySelector('.eg');
  eg.classList.add('hov');
  eg.querySelectorAll('path').forEach((p) => p.classList.toggle('hl', p.dataset.f === k || p.dataset.t === k));
  card.innerHTML = cardHtml(k);
  card.hidden = false;
  const R = el.getBoundingClientRect(), r = b.getBoundingClientRect();
  const cw = card.offsetWidth, chh = card.offsetHeight;
  const bl = r.left - R.left, br = r.right - R.left, bt = r.top - R.top, bb = r.bottom - R.top;
  let x, y;
  if (br + 8 + cw <= R.width - 4) { x = br + 8; y = bt; } // right of the box
  else if (bl - 8 - cw >= 4) { x = bl - 8 - cw; y = bt; } // left of it
  else { // no room beside it (phone): centred under it, or over it
    x = Math.max(4, Math.min(R.width - cw - 4, (bl + br) / 2 - cw / 2));
    y = bb + 8 + chh <= R.height - 4 ? bb + 8 : bt - 8 - chh;
  }
  y = Math.max(4, Math.min(R.height - chh - 4, y));
  card.style.left = x + 'px'; card.style.top = y + 'px';
}
function hideCard(el) {
  CARD = null;
  el.querySelector('.card2').hidden = true;
  el.querySelectorAll('.bx.on').forEach((x) => x.classList.remove('on'));
  const eg = el.querySelector('.eg');
  eg.classList.remove('hov');
  eg.querySelectorAll('path.hl').forEach((p) => p.classList.remove('hl'));
}

function wire(el) {
  const cv = el.querySelector('.cv'), card = el.querySelector('.card2');
  let drag = null, moved = false, hideT = 0;
  cv.addEventListener('pointerdown', (ev) => {
    moved = false;
    if (ev.pointerType !== 'mouse' || ev.button) return;
    drag = { x: ev.clientX, y: ev.clientY, l: cv.scrollLeft, t: cv.scrollTop };
  });
  addEventListener('pointermove', (ev) => {
    if (!drag) return;
    const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
    if (!moved && Math.hypot(dx, dy) > 4) { moved = true; cv.classList.add('drag'); hideCard(el); }
    if (moved) { cv.scrollLeft = drag.l - dx; cv.scrollTop = drag.t - dy; }
  });
  addEventListener('pointerup', () => { drag = null; cv.classList.remove('drag'); });
  cv.addEventListener('scroll', () => { if (!HOVER && CARD) hideCard(el); }, { passive: true });
  cv.addEventListener('click', (ev) => {
    if (moved) { moved = false; return; }
    const b = ev.target.closest('.bx');
    if (!b) { hideCard(el); return; }
    if (HOVER || CARD === b.dataset.k) openEntry(b.dataset.k); // laptop: click opens; phone: 2nd tap opens
    else showCard(el, b);
  });
  if (HOVER) {
    cv.addEventListener('mouseover', (ev) => {
      const b = ev.target.closest('.bx');
      if (!b || drag) return;
      clearTimeout(hideT);
      if (CARD !== b.dataset.k) showCard(el, b);
    });
    cv.addEventListener('mouseout', (ev) => { if (ev.target.closest('.bx')) { clearTimeout(hideT); hideT = setTimeout(() => hideCard(el), 250); } });
    card.addEventListener('mouseenter', () => clearTimeout(hideT));
    card.addEventListener('mouseleave', () => { hideT = setTimeout(() => hideCard(el), 200); });
  }
  card.addEventListener('click', (ev) => { const g = ev.target.closest('[data-open]'); if (g) openEntry(g.dataset.open); });
  el.querySelector('.zm').addEventListener('click', (ev) => {
    const z = ev.target.closest('[data-z]'); if (!z) return;
    const n = Math.max(ZMIN, Math.min(ZMAX, Z * ZSTEP ** +z.dataset.z));
    if (n !== Z) { Z = n; hideCard(el); zoom(el, true); }
  });
}

function fit(el) {
  const cv = el.querySelector('.cv');
  if (!cv) return;
  const top = cv.getBoundingClientRect().top + scrollY;
  cv.style.height = Math.max(240, innerHeight - top - 20) + 'px';
}

window.drawChart = function drawChart() {
  const el = $('chart');
  if (!FARMS.length && !TRICKS.length) { el.innerHTML = '<div class="muted empty">Loading…</div>'; return; }
  const sig = JSON.stringify(Object.keys(coreEntries(PLAN))) + ':' + MILESTONES.length;
  if (!Object.keys(coreEntries(PLAN)).length) { el.innerHTML = '<div class="muted empty">No core farms yet.</div>'; return; }
  if (!CH || sig !== CH_SIG) {
    CH = compute(); CH_SIG = sig;
    paint(el);
    fit(el);
    fitZoom(el);
    zoom(el, false);
    el.querySelector('.cv').scrollTo(0, 0);
  } else fit(el);
};
addEventListener('resize', () => { if (MODE === 'chart' && CH) { const el = $('chart'); fit(el); if (WIDE_C()) { fitZoom(el); zoom(el, false); } } });
if (MODE === 'chart') window.drawChart();
