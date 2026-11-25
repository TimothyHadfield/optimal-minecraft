# Optimal Minecraft (Farms + Horses): progress

## START HERE
Last updated 2026-11-24. Read `CLAUDE.md` first (file map, traps), then this file, then `chat.md`, then `docs/farms-catalogue.md` for the ianxofour sources.

## Goal right now
Tim's Minecraft site: main page → **Farms** (`farms/`: record of farms, tricks, villager trades, CHART of the core farms) and **Horses** (`horses/`). ROUTE tab live 2026-11-24. Open: Tim's pick on the suggested farm swaps (enderman XP, creeper/gunpowder, merge turtle egg, cut wither rose) — not built. An "expanded" chart (all farms + tricks) is planned later (Tim: "then we can make an expanded version later").

## Status
| Area | State |
|---|---|
| Live | https://timothyhadfield.github.io/optimal-minecraft/ (main), /farms/, /horses/. Old https://timothyhadfield.github.io/craft-horse/... forwards (separate repo `craft-horse`, index.html + 404.html, path kept) |
| Main page | 2026-11-24: one icon card per section (`SECTIONS` array) |
| Horses | Calculator, stable, breeding, backup. Moved to `horses/` 2026-11-24; localStorage kept (per origin) |
| Farms data | `farms/farms.json` 83 records: n 1–27 ianxofour, 101–142 basic manual farms, 201–214 other YouTubers (core items only, deduped by mechanism + item; copies listed in `sources`). 214 = max gold (C5 llama-aggro via Shulkercraft, ~960 gold blocks/h) |
| Plan overlay | `farms/plan.json`: per `farm:<n>` / `trick:<id>`: stage, milestone (deep-mining / nether / end), icon, short, steps, prereqs [{ref, rating 1–5, why}], raw, and for farms `rank` + `core` |
| Core 18 (rank order = Tim's build order) | no milestone: 27 day-1 iron, 101 wheat, 117 cow, 107 sugar cane, 24 trading hall · deep-mining: 202 cobble, 208 mob · nether: 5 tree, 137 turtle egg, 19 gold, 12 bartering, 17 wither skel · end: 8 obsidian, 11 wither rose, 213 raid, 15 shulker, 201 max iron, 214 max gold |
| Tricks | 51 in `farms/tricks.json`, real video frames `pics/trick-<id>.jpg` (picOf default in farms/index.html) |
| Trades | `farms/trades.json`, Java 26.3 (13 professions / 183 trades, wandering trader 100, 8 experimental tables) |
| Pictures | `farms/pics/`: ALL real video frames, no drawn pictures (Tim: "0 farms or tasks have images that are built by you"). farm-<n>.jpg (1–27, 201–214), basic-<slug>.jpg, trick-<id>.jpg; sources per picture in scratchpad map.json only (not kept). Weak: 26, 211, beetroot, melon, tree, spruce (Bedrock), berries (Bedrock), iron golem, composter, moss, lava-lake-portal (no portal), elytra-rockets, seed-map (Console), spawn-chunk, hero-of-village. Icons `farms/icons/<id>.png` (~418, minecraft.wiki) |
| CHART | Core farms only, all prereq links between them (rating 2–5, red→green, 5 thicker), milestone bands, hover/tap preview, 1×/2×/3× icon rule within same-icon groups. 2026-11-24 chartfit: laptop shape (column only as wide as its widest box, gaps 76 in a band / 96 across a milestone, 7 rows, build-order `rank` left→right in a band). CHART_STATS with 214 (2026-11-24, phone-view desktop 1440): 18 nodes, 25 lines, **1 crossing** (tree→wood line crosses turtle egg→wither skel), 0 box hits, 0 bends, 3 order swaps, boxes 59 px |
| ROUTE tab (2026-11-24, fc0cb9c) | Tim: "make an "optimal route" with exact instructions on what to do in order ... Really consider what you're going to have after each thing and if that is sufficient". `farms/route.json` (49 steps: Start / Deep mining / Nether & fortress / End dragon; 38 open a farm or trick; green HAVE lines) + `farms/route.js`; BACK returns to route at same scroll. Changes vs Tim's core order: bartering after End cities (needs shulker boxes), sand duper before shulker farm, plus support steps (sheep, pumpkin, oak, villagers, librarians, branch mining, obsidian by hand, cleric pearls, bamboo, furnace array, desert sand, fortress, blazes, zombie cure, stronghold, dragon, gateway, End cities, snow golem, sculk sensor, ominous bottles, AFK fishing, magma by hand). Tab padding narrowed under 480 px (5 tabs overflowed). Verified WebKit 393 + 1440: 0 errors, every link resolves. Gaps: no magma farm (8,640 magma by hand), step 41 uses amethyst icon |
| ROUTE rework (2026-11-25, f4b53bf) | Tim's notes: village = base (no boating), hay feeds cows, no early wool/pumpkins (sell iron for emeralds), no oak farm (2x2 spruce), bone meal source for tree farm, glass from librarians, name tags craftable. 49→46 steps: End trip earlier (right after gold farm + pearls), zombie cure before cleric pearls, tree farm after wither skel (bones), snow golem before obsidian farm, auto pumpkin farm before bartering, glass bought (~200 then 2,400), sand duper/desert/AFK fishing/sheep/pumpkin/oak/boat cut. Groups now flow across laptop columns (even). Conflicts with plan.json ranks (not changed): cow before wheat, dragon before tree/bartering/wither skel, tree after wither skel, bartering after obsidian. plan.json prereq note "mason sells the quartz" is wrong (masons don't sell quartz items) — not fixed yet |
| Fonts | Inter (text) + Pixelify Sans (headings/tabs) |
| Tests | No suite. 2026-11-24 late: python check that all 83 farms + 51 tricks resolve to an existing non-SVG picture; phone-view WebKit 393 px tricks list + 1440 farms: 0 failed requests, 0 broken images. Live 2e3ed28 |

## Authorized next steps
None.

## Standing instructions (Tim's words)
- (2026-11-24) "make the most optimal route on which farms to build ... I already have a brainstormed list of the order and whatnot but first I just want you to research all of his farms ... and just make a record of them."
- (2026-11-24) "chang the style of the cite so it's much less wordy, and image-friendly. Each farm should be represented by the item that it's farming, and any time you reference something, have that item be shown."
- (2026-11-24) Prereqs: "Rate each prereque on a scale from 1-5 on how necessary it is"; consider difficulty of the prereq farm and how many items are needed, and ingredients of ingredients.
- (2026-11-24) Chart: "Represent each farm as a small box with the core item ... and nothing else"; hover shows "only the core details"; lines "as simple and clear as possible"; low prereq red, high green; "There's only maybe 15 very important farms so those are all the boxes ... Let's not even put skills right now".
- (2026-11-24) Other YouTubers: "only make the very core ones and be very careful that nothing repeats ... Very random farms ... (cocao, tridents, etc.) don't need to be added".
- (2026-11-24) Tim's build order (core list): day-1 iron · 1x1 cow · 9x9 wheat · simple sugar cane · simple trading hall · [deep mining] · cobblestone · mob · [Nether and fortress] · versatile wood · turtle egg · simple gold · bartering · wither skeleton · [end dragon] · obsidian · wither rose · raid · shulker · max iron · max gold. Then: "you don't need to follow that explicitly and I'm sure theres some improvements". Applied in plan.json (core 18, wheat moved before cow; max gold = farm 214).
- (2026-11-24) "change the minecraft farm images so that 0 farms or tasks have images that are built by you and instead are all actual screenshots of the farm". Done.
- (2026-11-24) "do you think there are big improvements ... Maybe replace one farm with another, or add something ... Don't change anything yet just talk to me." Answered (see Decisions); awaiting his pick.
- (2026-11-24) "rename the repository to just optimal minecraft"; "a main page, a farm page, and a horse page ... you don't see any "horse" and "farm" bars at the top".

## Traps
- See `CLAUDE.md` > Traps (pinned CDN versions, font-family quoting, sync refs, Monte Carlo breeding).
- Farms page is plain JS (no Babel) on purpose.
- All ianxofour farms are Java only; several version-limited (`versions` + `version_notes`). 202 needs TNT duping (some servers disable it); 213 uses more ominous bottles than it returns.
- Litematica counts include terrain for some (see each record's `materials_litematic.differences`). #3's on-screen list omits 1,122 nether bricks.
- New core farms change the chart; `corelayout.js` searched 0 crossings for today's set but a test set with one extra core farm gave 1 crossing.
- CHART_STATS `ms`: ~0.5 s in Chrome, 3–6 s in phone-view's WebKit (Playwright WebKit on Windows has no JIT; not a real-iPhone number).
- The local folder is still named `Craft_Horse` (project memory is keyed to the path); repo is optimal-minecraft.
- Research tools: `tools/litecount.py`, `tools/farm-research-brief.md`, `tools/get-icons.py`, `tools/gen-trick-pics.py` (makes drawn SVGs: obsolete, don't use; Tim wants real screenshots only).
- Picture method (agents): yt-dlp clip → ffmpeg frames → pick by eye → 640×360 JPEG q85, no overlays/facecams. Source URLs per picture were in scratchpad `realpics/*/map.json` (temporary, not in repo).
- Stale worktree `C:/Users/timha/AppData/Local/Temp/claude/wt/craft-horse-chartfit` (merged; remove failed on OneDrive lock, weekly sweep). Merge script for new farm batches lived in the scratchpad (`merge_others.py`): append records, plan entries, prereq changes, then re-rank.

## Decisions
- 2026-10-16 · pinned React 18.3.1 / Babel 7.29.9; input sync fix; import validation.
- 2026-11-24 · Materials source order: on-screen list first, Litematica count cross-check, transcript.
- 2026-11-24 · 3 milestones only: Deep mining, Nether, Beat the End.
- ~~2026-11-24 · Drawn SVG pictures for tricks and basic farms~~ → replaced same day by real YouTube frames (4 agents).
- 2026-11-24 · Suggested to Tim (not built, he said "don't change anything yet"): add enderman XP farm + creeper/gunpowder farm, fold turtle egg into simple gold, drop wither rose first if trimming.
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
