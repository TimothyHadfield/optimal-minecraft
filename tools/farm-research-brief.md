# Brief: exact materials and requirements for ianxofour farms

Never ask permission for anything. Prefer PowerShell and the Read/Write/Edit tools over Bash. Never write into a `.claude` folder. No installs (yt-dlp, ffmpeg, python, node are already installed).

## Tim's words (verbatim)
"I'm basing my info off of a youtuber called ianxofour that does a bunch of "instant farms" that are really really good and pretty much revolutionary for minecraft. I want to make the most optimal route on which farms to build and exactly what to do in each step of the game in order to do the best route and the most progress. This relates a lot on the required materials for each farm, as well as how usefull the farm is itself. Many items might need a farm itself in order to build it. ... first I just want you to research all of his farms and the exact ingredients and requirements for each one as well as any other details and just make a record of them."

## Inputs (all under S = a scratch folder; tools are in this repo's `tools/`, `mfget.py` was a small MediaFire downloader not kept)
- `S/catalogue.md`: the 27 videos (numbered #1–#27), with download links per farm.
- `S/descs.json`: the full YouTube descriptions.
- `S/tools/mfget.py URL OUTDIR`: downloads a MediaFire or tinyurl→MediaFire file (`python -I`).
- `S/tools/litecount.py FILE.litematic [--json]`: exact block counts from a Litematica schematic, converted to items (double slab = 2, door/bed halves once, water source = water bucket), plus entities. Already tested.

## Method per video (do all of these)
1. **Chapters + spoken details:** `yt-dlp --skip-download --dump-json URL` gives `chapters`. `yt-dlp --skip-download --write-auto-subs --sub-langs en --sub-format vtt -o S/subs/<n> URL` gives the transcript. Use it for rates, requirements, version notes, AFK spot, and build gotchas.
2. **On-screen materials list (the main source):**
   - Download only the materials chapter: `yt-dlp -q --no-warnings -f "bv*[height<=1080][ext=mp4]/bv*[height<=1080]" --download-sections "*START-END" -o S/frames/<n>/clip.%(ext)s URL`. END is the next chapter's start, capped at 120 s.
   - Extract frames: `ffmpeg -loglevel error -i clip.mp4 -vf "fps=1/3,scale=1280:-1" S/frames/<n>/f%02d.jpg`.
   - Read the frames with the Read tool. The list is usually a chest or inventory screen, sometimes text. Transcribe every item and its stack count, and read the small numbers carefully, checking more than one frame.
   - If an icon is ambiguous, say so (e.g. "scaffolding? (icon unclear)"). Hovered tooltips show names.
   - If the chapter has no clear list, try a 1080p re-download or nearby frames.
   - Delete clip.mp4 when done.
3. **Litematic, if the catalogue lists one:** download it with mfget.py and run litecount.py. Record the counts separately from the on-screen list, and note differences. Skip world-download zips unless there's no other materials source; if a zip holds a .litematic, use it.
4. **Requirements:**
   - dimension, biome, structure (e.g. needs an ocean monument, fortress, End city, swamp, slime chunk), and mobs to bring (villagers, a zombie, piglins, shulkers, a wither, ...);
   - the game stage it's reachable at (day 1 / early / needs Nether / needs End / needs elytra);
   - tools or enchantments (Looting III sword, etc.);
   - **materials that are themselves hard and may need another farm** (e.g. lots of hoppers need iron, so an iron farm; lots of obsidian; slime blocks need slime; honey blocks; TNT needs gunpowder; tridents, ...). List them explicitly.
5. **Output / usefulness:** every item it produces, with the rate per hour and its conditions (looting, number of players, version), as stated by him (title, description or video). Also list XP.

## Output: one JSON file per video at S/farms/<n>.json (n = the catalogue number), exactly this shape
```json
{
  "n": 27, "id": "iron-day1", "title": "<exact title>", "url": "https://www.youtube.com/watch?v=...", "date": "2020-12-23",
  "edition": "Java", "versions": "1.16+", "version_notes": "e.g. broken in 1.21, fix link ...",
  "category": "farm | farm add-on | not a farm",
  "farm_type": "iron",
  "outputs": [{"item": "iron_ingot", "rate_per_hour": 400, "conditions": "...", "source": "title|description|video m:ss"}],
  "xp": "none | text",
  "materials_onscreen": {"timestamp": "4:08", "items": [{"item": "white_bed", "count": 6, "note": ""}], "notes": "how sure, unclear icons"},
  "materials_litematic": {"file": "name", "items": {"hopper": 68}, "entities": {"bee": 37}} ,
  "materials_variants": [{"name": "upgrade / bigger version", "items": [{"item": "...", "count": 0}]}],
  "requires": {"dimension": "overworld", "location": "any village / ocean monument / ...", "mobs": ["3 villagers", "1 zombie"],
               "stage": "day 1", "tools": [], "hard_materials": [{"item": "hopper", "count": 1, "why_hard": "5 iron each", "farm_that_helps": "iron"}]},
  "afk_spot": "", "build_time": "if stated", "chapters": [{"t": "0:00", "title": "..."}],
  "downloads": [{"kind": "world|litematic|image", "url": "..."}],
  "gotchas": ["..."], "sources": ["url or 'video 4:08 frames'"],
  "confidence": "high/medium/low + why"
}
```
Use Minecraft item ids (snake_case). Leave out a key's value with null if unknown; never invent numbers. Mark anything inferred with "(inferred)".

## Your return message
A short table: n | farm | how many material lines were read on screen | litematic? | confidence | problems.
