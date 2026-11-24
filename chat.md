# Optimal Minecraft (repo optimal-minecraft, was craft-horse): chat log

## 2026-11-24: Farms section + ianxofour record + Tricks
- **Asked:** a Minecraft-optimal farms project paired with the horse app ("a sub-section of each"); research every ianxofour farm's exact materials and requirements and record them; then a list of non-farm "tricks" (nether roof portal, lava-lake portal, early horse...).
- **Decided:** same repo/site; Farms at `farms/`; horse URL unchanged; no rename (Tim's call).
- **Built:** `farms/index.html` (list + detail, Farms/Tricks toggle, search), `farms/farms.json` (27 videos), `farms/tricks.json` (51), HORSES | FARMS switch on both pages, `docs/farms-catalogue.md`, `tools/litecount.py`.
- **How researched:** channel uploads list → 27 Minecraft videos (all Java). Per video: yt-dlp clip of the "Materials" chapter → ffmpeg frames → read on screen; Litematica files downloaded from his MediaFire links and counted (11); transcripts for rates/requirements.
- **Verified:** phone-view WebKit 393 px and 1440 px desktop on a local server: no overflow, no console errors; horse page still loads.
- **Open:** Tim's own build order → route optimizer (not started).

## 2026-11-24 (later): trades, picture cards, plan/prereqs, chart, split, other YouTubers
- **Asked:** every villager trade; basic manual farms; pictures; "much less wordy, and image-friendly"; item icons everywhere; early/mid/late; prereqs rated 1–5; flowchart with milestone lines; red→green lines; 1×/2×/3× icons; other YouTubers' core farms, no repeats; readable font; rename to "optimal minecraft"; main page + separate farm and horse pages, no switch bars; farms ordered by importance; chart = only ~15 core farms, no tricks.
- **Built:** trades.json (Java 26.3) + TRADES tab; 42 basic farms (101–142); picture cards (real video frames for 1–27 and 201–213, drawn SVGs for basic farms and tricks); plan.json (stage, milestone, short, steps, prereqs, raw, rank, core); CHART tab (`chart.js` + `corelayout.js`); main page `index.html`, horse app → `horses/`; Inter + Pixelify Sans; 13 farms from other creators (201–213), 4 replace core slots (202 cobble, 203 villager crops, 208 mob, 213 1.21.2+ raid). Repo renamed to optimal-minecraft; a new `craft-horse` repo forwards old links (path kept).
- **Verified:** phone-view WebKit 393 px + desktop for main, horses (seeded stable), farms list/detail, chart (CHART_STATS: 15 nodes, 16 lines, 0 crossings, 0 bends); old `craft-horse/farms/` link lands on `optimal-minecraft/farms/` (live, 2026-11-24). Live e3b2818.
- **Open:** route optimizer still waits for Tim's build order; expanded chart (all farms + tricks) later.

## 2026-11-24 (late): Tim's build order, bigger chart, max gold, real screenshots
- **Asked:** use his build order (day-1 iron … max gold; "you don't need to follow that explicitly"); every picture a real screenshot ("0 farms or tasks have images that are built by you"); "big improvements ... Don't change anything yet just talk to me".
- **Built:** core 18 in his order (e62caf4); chartfit merged (bigger boxes, laptop shape); farm 214 max gold (C5 llama-aggro, Shulkercraft tutorial) as last core farm; 93 real YouTube frames replace every basic-/trick- SVG (SVGs git rm'd); picOf default → .jpg. Live 2e3ed28.
- **Suggested, not built:** enderman XP farm, creeper/gunpowder farm, fold turtle egg into simple gold, cut wither rose first.
- **Verified:** picture-path check (0 missing); phone-view 393 + 1440, 0 failed requests; CHART_STATS 18 nodes / 1 crossing.
- **Open:** Tim's pick on the suggestions; weak pictures listed in progress.md; 1 chart crossing.
