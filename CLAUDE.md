# Optimal Minecraft (repo: optimal-minecraft, was craft-horse)

Tim's Minecraft site (and anyone with the link): a main page linking to sections. **Farms**
(farm records, tricks, villager trades, build chart) and **Horses** (a horse and donkey
calculator: 0-100 perfection score, a saved stable, breeding advice). Used on iPhone and laptop.

- **Live:** https://timothyhadfield.github.io/optimal-minecraft/
- **Repo:** https://github.com/TimothyHadfield/optimal-minecraft (public)
- **Main checkout:** `OneDrive\Desktop\my-website\Code Projects\Games\Craft_Horse`

## File map
- `index.html`: the main page. One tappable card per section from the `SECTIONS` array in the
  page (name, href, icon). Add a section there.
- `horses/index.html`: the horse app. React 18 + in-browser Babel from unpkg, JSX in one
  `<script type="text/babel">`. Components: `HorseCalc` (main), `StatRow`, `ParentCard`,
  `BreedingTab`, `ProbRow`. Pure helpers at the top (`normalize`, `computeTotal`,
  `simulateFoal`, `analyzePair`, `findDominated`, `findStatLeaders`).
- `horses/horse_calculator.jsx`: older stand-alone version (an `export default` React component).
  Not loaded by the site. Kept as history; don't edit it expecting the site to change.
- `icon.svg`, `apple-touch-icon.png`: at the root, shared by all pages (sub-pages use `../`).
- `docs/screenshots/`: images used by `README.md`.
- `farms/index.html`: the Farms section (plain JS, no Babel): list + detail, Farms/Tricks toggle,
  search. Data: `farms/farms.json` (27 ianxofour videos, one record each) and `farms/tricks.json`.
  `docs/farms-catalogue.md`: the video catalogue with every download link and source.
- Each sub-page has a small ◀ home link at the top-left that goes to `../` (the main page).
- Fonts: Inter for text, numbers and inputs; Pixelify Sans for headings, buttons and tabs
  (both Google Fonts).
- Git-ignored: `stable*.json` (Tim's exported stables, personal data), `minecraft_horse.jsx`
  (duplicate of horse_calculator.jsx), `.claude/`.

## Data
- No backend, no accounts. Everything is in the browser's `localStorage`, four keys:
  `horse_perfect`, `horse_trash`, `donkey_perfect`, `donkey_trash` (arrays of
  `{id, name, speed, jump, hearts, total}`). Legacy keys `horses` / `trash_horses` are
  migrated once on load.
- Export writes `stable.json` (version 2, all four stables). Import accepts v1 and v2 and
  rejects a file whose entries lack numeric speed/jump/hearts (a bad entry used to blank
  the page on every load).
- Scores are always recomputed from raw stats with the current MIN/MAX constants; the stored
  `total` is not used for display.

## Run locally
`python -m http.server 8102` in the repo folder (background), then open http://localhost:8102/
(main), `/horses/`, `/farms/`.
Needs internet (React, Babel and Google Fonts come from CDNs).

## Test
No test suite. Verify with `node ~/.claude/tools/phone-view.mjs <url>` (phone and `--desktop`).
Seed a stable with `--local 'horse_perfect=[{"id":1,"name":"A","speed":12,"jump":4,"hearts":14},...]'`.
phone-view `--do fill:`/`click:` selectors cannot contain `=`; drive inputs through `--eval`
(native value setter + `input` event) instead.

## Deploy
GitHub Pages from `main`, root folder. Push to `main` and it is live in about a minute.

## Traps
- **CDN versions must stay pinned.** Unpinned `@babel/standalone` became Babel 8, which emits
  ES `import`s for JSX and blanked the live page (found 2026-10-16). Keep Babel on 7.x.
- In the horse app's template CSS (`<style>{`...`}</style>`) write font-family plainly
  (`font-family: "Pixelify Sans", monospace;`). It used to be quoted twice
  (`'"Press Start 2P", monospace'`), which is invalid CSS and fell back to serif; fixed in the
  2026-11-24 font change. In JSX inline styles the outer single quotes are the JS string, so
  `fontFamily: '"Pixelify Sans", monospace'` is correct there.
- localStorage is per origin, not per path, so the move to `horses/` kept every stable.
- phone-view `--local` from PowerShell 5.1: escape inner quotes as `\"` and avoid spaces in the
  value, or the JSON arrives cut off.
- Speed/jump/health text boxes, the items box and blocks/layers boxes sync through "skip next
  sync" refs. Only set a ref when the value really changes, or the flag sticks and the next
  slider move is ignored (fixed 2026-10-16).
- Breeding numbers are Monte Carlo (800 foals per pair), so they change on every render;
  screenshots of the BREED tab never match pixel for pixel.
