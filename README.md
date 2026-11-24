# Optimal Minecraft

Minecraft tools in one site: a **Farms** section (farm records, tricks, villager trades and a build-order chart) and a **Horses** section (a horse and donkey calculator).

**[▶ Open the live site](https://timothyhadfield.github.io/optimal-minecraft/)** · works on phone and laptop

## Horses
Enter a horse's speed, jump and health to get a perfection score, keep a stable of your best horses, and see which two to breed next.

<p align="center">
  <img src="docs/screenshots/desktop.png" alt="Breeding tab recommending which two horses to breed" width="68%">
  &nbsp;
  <img src="docs/screenshots/phone.png" alt="Calculator showing a horse scoring 82.5" width="24%">
</p>

- **Perfection score**: speed, jump and health each scaled against Minecraft's real minimum and maximum, averaged into one 0 to 100 score.
- **Enter stats the way you measure them**: speed from an items-per-trip count (760 ÷ items), jump in blocks plus snow layers, health in hearts.
- **Your stable**: save horses, load them back into the calculator, and delete the ones you release.
- **Breeding advice**: simulates 800 foals per pair and ranks every pair by expected foal, best result, and chance to beat both parents.
- **Stat leaders and culling**: shows who leads in each stat and which horses are beaten in every stat by another, so they're safe to let go.
- **Horse or donkey, perfect or trash**: four separate stables, including a "trash" mode that hunts for the worst possible horse.
- **Backup**: export all stables to a `stable.json` file and import it on another browser.

## Farms
Every ianxofour farm with its outputs, materials, prerequisites and stage, plus a Tricks list, villager trades and a chart of what to build first.

## Built with
Plain HTML pages: React 18 and Babel from a CDN for the horse calculator, plain JavaScript for the rest, Inter and Pixelify Sans from Google Fonts, and localStorage for saving.
