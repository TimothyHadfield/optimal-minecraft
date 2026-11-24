# Optimal Minecraft (Farms + Horses): progress

## START HERE
Last updated 2026-11-24. Read `CLAUDE.md` first (file map, traps), then this file, then `chat.md`, then `docs/farms-catalogue.md` for the ianxofour sources.

## Goal right now
Tim's Minecraft site: main page → **Farms** (`farms/`: record of farms, tricks, villager trades, CHART of the core farms) and **Horses** (`horses/`). Next (not authorized yet): Tim has his own brainstormed build order; the route optimizer waits for him. An "expanded" chart (all farms + tricks) is planned later (Tim: "then we can make an expanded version later").

## Status
| Area | State |
|---|---|
| Live | https://timothyhadfield.github.io/optimal-minecraft/ (main), /farms/, /horses/. Old https://timothyhadfield.github.io/craft-horse/... forwards (separate repo `craft-horse`, index.html + 404.html, path kept) |
| Main page | 2026-11-24: one icon card per section (`SECTIONS` array) |
| Horses | Calculator, stable, breeding, backup. Moved to `horses/` 2026-11-24; localStorage kept (per origin) |
| Farms data | `farms/farms.json` 82 records: n 1–27 ianxofour, 101–142 basic manual farms, 201–213 other YouTubers (core items only, deduped by mechanism + item; copies listed in `sources`) |
| Plan overlay | `farms/plan.json`: per `farm:<n>` / `trick:<id>`: stage, milestone (deep-mining / nether / end), icon, short, steps, prereqs [{ref, rating 1–5, why}], raw, and for farms `rank` + `core` (15 core) |
| Core 15 (rank order) | 27 day-1 iron, 202 auto cobble, 5 tree, 19 gold, 203 villager crops, 213 raid (1.21.2+), 8 obsidian, 15 shulker, 17 wither skel, 208 mob (1.21), 24 trading hall, 12 bartering, 18 slime, 1 concrete, 14 guardian. Replaced ones (125, 101, 22, 23) rank right after |
| Tricks | 51 in `farms/tricks.json`, drawn SVG pictures |
| Trades | `farms/trades.json`, Java 26.3 (13 professions / 183 trades, wandering trader 100, 8 experimental tables) |
| Pictures | `farms/pics/`: farm-<n>.jpg real video frames (1–27, 201–213; #26 and #211 weak), basic-<slug>.svg, trick-<id>.svg. Icons `farms/icons/<id>.png` (~418, minecraft.wiki) |
| CHART | Core farms only, all prereq links between them (rating 2–5, red→green, 5 thicker), milestone bands, hover/tap preview, 1×/2×/3× icon rule within same-icon groups. 2026-11-24 chartfit: laptop shape (column only as wide as its widest box, gaps 76 in a band / 96 across a milestone, 7 rows, build-order `rank` left→right in a band). CHART_STATS: 17 nodes, 22 lines, 0 crossings, 0 box hits, 0 bends, 1 order swap, 1472×738, boxes 61 px at 1440×900, 54 px at 1280×800, 47 px on phone |
| Fonts | Inter (text) + Pixelify Sans (headings/tabs) |
| Tests | No suite. phone-view WebKit 393 px + desktop (2026-11-24, local + live redirect) |

## Authorized next steps
None.

## Standing instructions (Tim's words)
- (2026-11-24) "make the most optimal route on which farms to build ... I already have a brainstormed list of the order and whatnot but first I just want you to research all of his farms ... and just make a record of them."
- (2026-11-24) "chang the style of the cite so it's much less wordy, and image-friendly. Each farm should be represented by the item that it's farming, and any time you reference something, have that item be shown."
- (2026-11-24) Prereqs: "Rate each prereque on a scale from 1-5 on how necessary it is"; consider difficulty of the prereq farm and how many items are needed, and ingredients of ingredients.
- (2026-11-24) Chart: "Represent each farm as a small box with the core item ... and nothing else"; hover shows "only the core details"; lines "as simple and clear as possible"; low prereq red, high green; "There's only maybe 15 very important farms so those are all the boxes ... Let's not even put skills right now".
- (2026-11-24) Other YouTubers: "only make the very core ones and be very careful that nothing repeats ... Very random farms ... (cocao, tridents, etc.) don't need to be added".
- (2026-11-24) "rename the repository to just optimal minecraft"; "a main page, a farm page, and a horse page ... you don't see any "horse" and "farm" bars at the top".

## Traps
- See `CLAUDE.md` > Traps (pinned CDN versions, font-family quoting, sync refs, Monte Carlo breeding).
- Farms page is plain JS (no Babel) on purpose.
- All ianxofour farms are Java only; several version-limited (`versions` + `version_notes`). 202 needs TNT duping (some servers disable it); 213 uses more ominous bottles than it returns.
- Litematica counts include terrain for some (see each record's `materials_litematic.differences`). #3's on-screen list omits 1,122 nether bricks.
- New core farms change the chart; `corelayout.js` searched 0 crossings for today's set but a test set with one extra core farm gave 1 crossing.
- CHART_STATS `ms`: ~0.5 s in Chrome, 3–6 s in phone-view's WebKit (Playwright WebKit on Windows has no JIT; not a real-iPhone number).
- The local folder is still named `Craft_Horse` (project memory is keyed to the path); repo is optimal-minecraft.
- Research tools: `tools/litecount.py`, `tools/farm-research-brief.md`, `tools/get-icons.py`, `tools/gen-trick-pics.py`. Merge script for new farm batches lived in the scratchpad (`merge_others.py`): append records, plan entries, prereq changes, then re-rank.

## Decisions
- 2026-10-16 · pinned React 18.3.1 / Babel 7.29.9; input sync fix; import validation.
- 2026-11-24 · Materials source order: on-screen list first, Litematica count cross-check, transcript.
- 2026-11-24 · 3 milestones only: Deep mining, Nether, Beat the End.
- 2026-11-24 · Drawn SVG pictures for tricks and basic farms (no real screenshots available).
- 2026-11-24 · Importance rank chosen by Claude from Tim's list (day-1 iron, cobblestone, wood, gold, auto wheat, raid, obsidian, shulker, wither skeleton, mob first).
- 2026-11-24 · "Auto wheat" slot filled by a villager carrot/potato farm (203): no separate auto-wheat design found worth adding.
- 2026-11-24 · Repo renamed craft-horse → optimal-minecraft; new `craft-horse` repo forwards old links.

## NOT verified
- Real iPhone.
- Rates are creators' claims, not measured in game. 204–208 have no rate.
- 203 after 1.21.5 crop-growth change; 204 on 1.21.6–1.21.8; 211 after 1.21.9 End change; 210 in 1.21.
- Tricks: TNT duper in 1.21.x, AFK fishing, water skiing after the 1.21.6 lead rework.

## Rejected / parked
- Parked: precompiling the horse JSX (~9 s phone first paint). Needs a build step; Tim's call.
- ~~Chart of all 120 farms + tricks~~ · 2026-11-24 · Tim: "a complete mess"; replaced by core-15 chart; expanded version later.
- ~~Temporary hover lines for low-rated links~~ · 2026-11-24 · not needed once the chart shows only core links (all drawn).
