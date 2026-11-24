// Farms CHART tab: plan.json -> the graph that layout.js lays out. Pure: no DOM (Node checks use it too).
// A box per entry; an arrow per prereq rated MIN_RATING+ (fewer lines, simpler); band = the entry's
// milestone (0 = needs none, then the plan's milestones in order).
// MIN_RATING 4, not 3: on the real plan.json (2026-11-24) rated 3+ drew 107 arrows with 118 crossings,
// rated 4+ draws 47 with 3 crossings. Rated-3 links still show in the hover card's "Build first".
export const MIN_RATING = 4;
// box and line sizes in px (small square icon boxes)
export const SIZES = { boxW: 40, boxH: 40, rowH: 54, gapMin: 44, track: 9, near: 7, pad: 14 };

// Line colour by prereq rating, red (low) -> green (high), on the dark brown background.
export const RATING_COLOR = { 1: '#e2553f', 2: '#e2553f', 3: '#f0a830', 4: '#d6cf3a', 5: '#7cc242' };

// Farms with the same core item: the icon shows 1x, 2x or 3x by how big the farm is (Tim, 2026-11-24:
// "put the item that is being farmed either 1, 2, or 3 times depending on how big the farm is and how much
// it produces"). Within a group of 2+ farms sharing an icon, rank by output rate and by build size (sum of
// plan raw material counts), averaged; smallest 1x, biggest 3x, the rest spread between. Alone: 1x. Tricks: 1x.
// rateOf(key) -> items per hour of the farm's main output (or 0). Returns Map key -> 1 | 2 | 3.
export function multiples(entries, rateOf) {
  const groups = new Map();
  for (const [k, v] of Object.entries(entries)) {
    if (!k.startsWith('farm:') || !v.icon) continue;
    (groups.get(v.icon) ?? groups.set(v.icon, []).get(v.icon)).push(k);
  }
  const size = (k) => Object.values(entries[k].raw || {}).reduce((s, n) => s + (+n || 0), 0);
  const out = new Map(Object.keys(entries).map((k) => [k, 1]));
  for (const ks of groups.values()) {
    if (ks.length < 2) continue;
    const rank = (f) => { const s = ks.slice().sort((a, b) => f(a) - f(b)); return new Map(ks.map((k) => [k, s.findIndex((x) => f(x) === f(k))])); };
    const rr = rank(rateOf), rs = rank(size);
    const sorted = ks.slice().sort((a, b) => rr.get(a) + rs.get(a) - (rr.get(b) + rs.get(b)) || rateOf(a) - rateOf(b) || size(a) - size(b));
    sorted.forEach((k, i) => out.set(k, 1 + Math.round((2 * i) / (sorted.length - 1))));
  }
  return out;
}
// box width for 1, 2 or 3 icons (26 px icons, each extra one 16 px further right)
export const boxWidth = (n) => 40 + (n - 1) * 16;

export function buildGraph(plan, { reduce = true } = {}) {
  const ms = plan.milestones || [];
  const msIndex = new Map(ms.map((m, i) => [m.id, i + 1]));
  const ents = plan.entries || {};
  const order = { early: 0, mid: 1, late: 2 };
  const keys = Object.keys(ents).sort((a, b) => (order[ents[a].stage] ?? 1) - (order[ents[b].stage] ?? 1) || a.localeCompare(b, 'en', { numeric: true }));
  const bandOf = new Map(keys.map((k) => [k, msIndex.get(ents[k].milestone) ?? 0]));
  const nodes = keys.map((id) => ({ id }));
  const edges = [];
  for (const k of keys) {
    const seen = new Set();
    for (const p of ents[k].prereqs || []) {
      if (!(p.rating >= MIN_RATING) || !(p.ref in ents) || p.ref === k || seen.has(p.ref)) continue;
      if (bandOf.get(p.ref) > bandOf.get(k)) continue; // would point back across a milestone line
      seen.add(p.ref);
      edges.push({ from: p.ref, to: k, rating: p.rating });
    }
  }
  // Skip an arrow when another path of drawn arrows already leads there (A -> B -> C makes A -> C a
  // repeat): every "needs" still reads off the chart, with far fewer lines. Kept when the direct link is
  // rated higher than the weakest link on every other path (opts.reduce: false keeps them all).
  const out = new Map(keys.map((k) => [k, []]));
  edges.forEach((e) => out.get(e.from).push(e));
  const reach = (from, to, skip, min) => { // a path from -> to avoiding edge skip, every link rated >= min
    const seen = new Set([from]), st = [from];
    while (st.length) {
      for (const e of out.get(st.pop())) {
        if (e === skip || e.rating < min || seen.has(e.to)) continue;
        if (e.to === to) return true;
        seen.add(e.to); st.push(e.to);
      }
    }
    return false;
  };
  const kept = reduce === false ? edges : edges.filter((e) => !reach(e.from, e.to, e, e.rating));
  return { nodes, edges: kept, all: edges, bandOf, milestones: ms };
}
