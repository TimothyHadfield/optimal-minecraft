# Minecraft (Horse Perfection + Farms): progress

## START HERE
Last updated 2026-11-24. Read `CLAUDE.md` first (file map, traps), then this file, then `docs/farms-catalogue.md` for the farm sources.

## Goal right now
The repo is now Tim's Minecraft site with two sections: **Horses** (the calculator, root) and **Farms** (`farms/`, the ianxofour farm record + a Tricks list). Next (not authorized yet): Tim has his own brainstormed build order; the route optimizer waits for him.

## Status
| Area | State |
|---|---|
| Live site | https://timothyhadfield.github.io/craft-horse/ (horses) and /farms/ |
| Calculator, stable, breeding, backup | Working (phone-view 2026-10-16) |
| Horses ⇄ Farms switch | 2026-11-24: plain two-button bar at the top of both pages |
| Farms record | 2026-11-24: all 27 ianxofour Minecraft videos (21 farms, 2 add-ons, 4 not-farms) in `farms/farms.json`: outputs/rates, requirements, hard materials (which other farm helps), on-screen materials list read from video frames, Litematica counts for 11, downloads, gotchas, confidence |
| Tricks list | 2026-11-24: 51 non-farm tasks (nether roof portal, lava-lake portal, early horse, trading, etc.) in `farms/tricks.json`, Farms/Tricks toggle on the Farms page |
| Tests | None. phone-view 393 px + desktop, no overflow, no console errors (2026-11-24, local server) |

## Authorized next steps
None.

## Standing instructions (Tim's words)
- (2026-11-24) "I want to make a new project that is about minecraft optimal, specifically about farms. Could you pair this with the horse project and have it be a sub-section of each? ... I want to make the most optimal route on which farms to build and exactly what to do in each step of the game ... This relates a lot on the required materials for each farm, as well as how usefull the farm is itself. Many items might need a farm itself in order to build it. I already have a brainstormed list of the order and whatnot but first I just want you to research all of his farms and the exact ingredients and requirements for each one ... and just make a record of them."
- (2026-11-24) Tricks: "a list of random things that you can do that aren't necessarily farms but might be very optimal, such as building a nether portal stright to the nether roof ... straight to a laval lake for fuel, getting a horse early ... different than things like "collecting ____" or "finding _____" but still actual tasks".

## Traps
- See `CLAUDE.md` > Traps (pinned CDN versions, double-quoted font-family, sync refs, Monte Carlo breeding).
- Farms page is plain JS (no Babel) on purpose: fast first paint.
- All ianxofour farms are **Java only**. Several are version-limited (raid farms 1.16–1.20, scaffolding mob farm ≤1.19.2): `versions` + `version_notes` per farm.
- Litematica counts include terrain/existing blocks for some (concrete End obsidian, tree-farm dirt); each record's `materials_litematic.differences` says so. #7 and #12 litematics are only add-ons. #3's on-screen list omits 1,122 nether bricks.
- Research tools: `tools/litecount.py` (counts a .litematic, own NBT reader, `python -I`) and `tools/farm-research-brief.md` (the brief the research agents followed: yt-dlp clip of the Materials chapter → ffmpeg frames → read).

## Decisions
- 2026-10-16 sweep: pinned React 18.3.1 / Babel 7.29.9; input sync fix; import validation.
- 2026-11-24 · Pairing = same repo/site, Farms at `farms/`, horse URL unchanged (no repo rename: name is Tim's call).
- 2026-11-24 · Materials source order: on-screen list (video frames at the Materials chapter) first, Litematica count as a cross-check, transcript for spoken counts.

## NOT verified
- On Tim's real iPhone.
- Rates are ianxofour's own claims; not measured in game. Unclear icons are noted per farm (`confidence`, `notes`).
- Tricks: TNT duper still working in 1.21.x, AFK fishing, water skiing after the 1.21.6 lead rework, some recipes (marked low/inferred in tricks.json).

## Rejected / parked
- Parked: precompiling the horse JSX (~9 s phone first paint). Needs a build step; Tim's call.
