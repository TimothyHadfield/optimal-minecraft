// Farms ROUTE tab: one ordered list of short steps from a fresh world to the max gold farm (route.json),
// grouped under the plan milestones like the CHART bands. A step with a ref opens that farm or trick
// (openEntry, as the chart does); BACK on a phone returns here at the same scroll spot.
// Uses the globals of index.html's main script ($, esc, icon, byKey, MILESTONES, openEntry, MODE).
(function () {
  const css = `
#route { margin-top: 8px; }
#route .rg { margin-bottom: 10px; } /* groups may flow across columns so the columns come out even */
#route .rm { display: inline-flex; align-items: center; gap: 5px; margin: 0 0 5px; padding: 1px 7px 1px 3px; border: 2px solid #ffd54a; color: #ffd54a; font-family: "Pixelify Sans", monospace; font-size: 15px; background: #1a1410; }
#route .rs { all: unset; box-sizing: border-box; display: flex; align-items: center; gap: 7px; width: 100%; min-height: 40px; padding: 4px 7px; margin-bottom: 4px; background: #1f1813; border: 2px solid #0a0805; break-inside: avoid; }
#route button.rs { cursor: pointer; }
#route button.rs:hover { border-color: #ffd54a; }
#route .rs .n { flex: none; width: 22px; text-align: right; color: #a89880; font-size: 13px; }
#route .rs .ics { flex: none; display: flex; width: 68px; }
#route .rs .ics .ic + .ic { margin-left: -8px; }
#route .rs .tx { flex: 1; min-width: 0; overflow-wrap: anywhere; }
#route .rs .ar { flex: none; color: #8b7355; font-size: 12px; }
#route .hv { display: flex; flex-wrap: wrap; align-items: center; gap: 3px 9px; margin: -2px 0 6px 29px; padding: 2px 6px; border-left: 2px solid #7cc242; font-size: 13px; color: #f4ead5; break-inside: avoid; }
#route .hv .lb { font-family: "Pixelify Sans", monospace; color: #7cc242; font-size: 12px; letter-spacing: 1px; }
#route .hv span { display: inline-flex; align-items: center; gap: 3px; }
#route .rs + .hv, #route .hv { break-before: avoid; }
#route .rw { break-inside: avoid; }
@media (min-width: 900px) { #route .cols { column-count: 2; column-gap: 14px; } }
@media (min-width: 1400px) { #route .cols { column-count: 3; } }
`;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

  let ROUTE = null, LOADING = false, Y = null;

  function html() {
    const steps = ROUTE.steps || [], start = ROUTE.start || { name: 'Start', icon: 'grass_block' };
    const ms = Object.fromEntries((MILESTONES || []).map((m) => [m.id, m]));
    const groups = [];
    steps.forEach((s, i) => {
      const id = s.milestone || '';
      if (!groups.length || groups[groups.length - 1].id !== id) groups.push({ id, steps: [] });
      groups[groups.length - 1].steps.push({ ...s, i: i + 1 });
    });
    return '<div class="cols">' + groups.map((g) => {
      const m = g.id ? (ms[g.id] || { name: g.id, icon: '' }) : start;
      return `<div class="rg"><div class="rm">${icon(m.icon)}${esc(m.name)}</div>` + g.steps.map((s) => {
        const ok = s.ref && byKey(s.ref);
        const tag = ok ? 'button' : 'div';
        const row = `<${tag} class="rs"${ok ? ` data-go="${esc(s.ref)}"` : ''}><span class="n">${s.i}</span><span class="ics">${(s.icons || []).map((x) => icon(x, 'l')).join('')}</span><span class="tx">${esc(s.text)}</span>${ok ? '<span class="ar">▶</span>' : ''}</${tag}>`;
        const have = (s.have || []).length ? `<div class="hv"><span class="lb">HAVE</span>${s.have.map((h) => `<span>${icon(h.icon)}${h.count != null ? esc(h.count) : ''}</span>`).join('')}</div>` : '';
        return `<div class="rw">${row}${have}</div>`;
      }).join('') + '</div>';
    }).join('') + '</div>';
  }

  window.drawRoute = function drawRoute() {
    const el = $('route');
    if (!ROUTE) {
      el.innerHTML = '<div class="muted">Loading…</div>';
      if (!LOADING) {
        LOADING = true;
        fetch('route.json', { cache: 'no-cache' }).then((r) => r.ok ? r.json() : { steps: [] }).catch(() => ({ steps: [] }))
          .then((d) => { ROUTE = d; if (MODE === 'route') drawRoute(); });
      }
      return;
    }
    if (!FARMS.length && !TRICKS.length) { el.innerHTML = '<div class="muted">Loading…</div>'; return; }
    el.innerHTML = html();
    if (Y != null) { const y = Y; Y = null; requestAnimationFrame(() => scrollTo(0, y)); }
  };

  $('route').addEventListener('click', (ev) => {
    const g = ev.target.closest('[data-go]');
    if (!g || !byKey(g.dataset.go)) return;
    Y = scrollY; // BACK comes back to this spot
    openEntry(g.dataset.go, 'route');
  });
  if (MODE === 'route') window.drawRoute();
})();
