# Minecraft (craft-horse): chat log

## 2026-11-24: Farms section + ianxofour record + Tricks
- **Asked:** a Minecraft-optimal farms project paired with the horse app ("a sub-section of each"); research every ianxofour farm's exact materials and requirements and record them; then a list of non-farm "tricks" (nether roof portal, lava-lake portal, early horse...).
- **Decided:** same repo/site; Farms at `farms/`; horse URL unchanged; no rename (Tim's call).
- **Built:** `farms/index.html` (list + detail, Farms/Tricks toggle, search), `farms/farms.json` (27 videos), `farms/tricks.json` (51), HORSES | FARMS switch on both pages, `docs/farms-catalogue.md`, `tools/litecount.py`.
- **How researched:** channel uploads list → 27 Minecraft videos (all Java). Per video: yt-dlp clip of the "Materials" chapter → ffmpeg frames → read on screen; Litematica files downloaded from his MediaFire links and counted (11); transcripts for rates/requirements.
- **Verified:** phone-view WebKit 393 px and 1440 px desktop on a local server: no overflow, no console errors; horse page still loads.
- **Open:** Tim's own build order → route optimizer (not started).
