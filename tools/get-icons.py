"""Fetch Minecraft inventory icons for a list of item ids.

Usage:  python get-icons.py <ids.txt> <out_folder> [--size 32]

ids.txt: one snake_case Minecraft id per line. Ids already present in the
output folder are skipped. Writes <out>/<id>.png (square, default 32x32) and
<out>/missing.txt listing ids that no source could provide.

Sources, in order:
  1. minecraft.wiki "Invicon_<Name>.png" (rendered inventory icon; blocks are
     isometric). Names are guessed from the id plus the ALIASES table below.
  2. PrismarineJS/minecraft-assets item/block textures (via jsDelivr).
  3. InventivetalentDev/minecraft-assets item/block textures (GitHub raw).
"""
import io
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

UA = "IconFetcher/1.0 (personal hobby project; python-urllib)"
API = "https://minecraft.wiki/api.php"

# id -> list of wiki names (without "Invicon_" / ".png"), tried in order,
# before the automatic guesses. Also used for odd ids (entities, groups).
ALIASES = {
    "banner": ["White_Banner", "Banner"],
    "white_banner": ["White_Banner", "Banner"],
    "diamond_block": ["Block_of_Diamond"],
    "emerald_block": ["Block_of_Emerald"],
    "gold_block": ["Block_of_Gold"],
    "iron_block": ["Block_of_Iron"],
    "redstone_block": ["Block_of_Redstone"],
    "quartz_block": ["Block_of_Quartz"],
    "copper_block": ["Block_of_Copper"],
    "coal_block": ["Block_of_Coal"],
    "lapis_block": ["Block_of_Lapis_Lazuli"],
    "netherite_block": ["Block_of_Netherite"],
    "hay_block": ["Hay_Bale"],
    "comparator": ["Redstone_Comparator"],
    "repeater": ["Redstone_Repeater"],
    "hopper_minecart": ["Minecart_with_Hopper"],
    "chest_minecart": ["Minecart_with_Chest"],
    "quartz": ["Nether_Quartz"],
    "rabbit_foot": ["Rabbit's_Foot"],
    "vine": ["Vines"],
    "writable_book": ["Book_and_Quill"],
    "bed": ["Red_Bed"],
    "button": ["Oak_Button"],
    "concrete_powder": ["White_Concrete_Powder"],
    "wool": ["White_Wool"],
    "potion": ["Potion", "Water_Bottle"],
    "splash_potion": ["Splash_Potion", "Splash_Water_Bottle"],
    "ender_eye": ["Eye_of_Ender"],
    "experience_bottle": ["Bottle_o'_Enchanting"],
    "experience_orb": ["Experience_Orb", "Bottle_o'_Enchanting"],
    "experience": ["Experience_Orb", "Bottle_o'_Enchanting"],
    "xp": ["Experience_Orb", "Bottle_o'_Enchanting"],
    "entities": ["Spawn_Egg", "Pig_Spawn_Egg"],
    "map": ["Empty_Map"],
    "filled_map": ["Map", "Filled_Map"],
    "dragon_breath": ["Dragon's_Breath"],
    "turtle_scute": ["Turtle_Scute", "Scute"],
    "redstone": ["Redstone_Dust"],
    "looting_iii_sword": ["Enchanted_Diamond_Sword", "Diamond_Sword"],
    "tipped_arrow": ["Tipped_Arrow", "Arrow_of_Poison", "Arrow_of_Healing"],
    "villager_trades": ["Emerald"],
    "wolves": ["Wolf_Spawn_Egg"],
    "zombies": ["Zombie_Spawn_Egg"],
    "villager": ["Villager_Spawn_Egg"],
    "zombie": ["Zombie_Spawn_Egg"],
    "sheep": ["Sheep_Spawn_Egg"],
    "snow_golem": ["Snow_Golem_Spawn_Egg"],
    "shulker": ["Shulker_Spawn_Egg"],
    "iron_golem": ["Iron_Golem_Spawn_Egg"],
    "bee": ["Bee_Spawn_Egg"],
    "wolf": ["Wolf_Spawn_Egg"],
    "cod_bucket": ["Bucket_of_Cod"],
    "salmon_bucket": ["Bucket_of_Salmon"],
    "pufferfish_bucket": ["Bucket_of_Pufferfish"],
    "tropical_fish_bucket": ["Bucket_of_Tropical_Fish"],
    "lava_cauldron": ["Lava_Cauldron", "Cauldron"],
    "chain": ["Iron_Chain", "Chain"],
    "beef": ["Raw_Beef"],
    "porkchop": ["Raw_Porkchop"],
    "mutton": ["Raw_Mutton"],
    "cod": ["Raw_Cod"],
    "salmon": ["Raw_Salmon"],
    "chicken": ["Raw_Chicken"],
    "rabbit": ["Raw_Rabbit"],
    "leather_chestplate": ["Leather_Tunic"],
    "leather_helmet": ["Leather_Cap"],
    "leather_leggings": ["Leather_Pants"],
    "leather_horse_armor": ["Leather_Horse_Armor"],
    "harness": ["White_Harness", "Harness"],
    "potion_of_fire_resistance": ["Potion_of_Fire_Resistance"],
    "potion_of_invisibility": ["Potion_of_Invisibility"],
    "splash_potion_of_weakness": ["Splash_Potion_of_Weakness"],
    "netherite_upgrade_smithing_template": ["Netherite_Upgrade_Smithing_Template", "Netherite_Upgrade"],
    "glistering_melon_slice": ["Glistering_Melon_Slice"],
    "clay_ball": ["Clay_Ball"],
    "nether_wart": ["Nether_Wart"],
    "slime_ball": ["Slimeball"],
    "snowball": ["Snowball"],
    "honey_bottle": ["Honey_Bottle"],
    "warped_fungus_on_a_stick": ["Warped_Fungus_on_a_Stick"],
    "lily_of_the_valley": ["Lily_of_the_Valley"],
    "totem_of_undying": ["Totem_of_Undying"],
    "brown_mushroom_block": ["Brown_Mushroom_Block"],
    "dried_kelp_block": ["Dried_Kelp_Block"],
    "firework_rocket": ["Firework_Rocket"],
    "rabbit_hide": ["Rabbit_Hide"],
    "oak_sign": ["Oak_Sign"],
    "spruce_sign": ["Spruce_Sign"],
    "wither_skeleton_skull": ["Wither_Skeleton_Skull"],
    "enchanted_book": ["Enchanted_Book"],
    "water_bucket": ["Water_Bucket"],
    "lava_bucket": ["Lava_Bucket"],
    "milk_bucket": ["Milk_Bucket"],
    "unknown_small_brown_item": [],
}

# texture-name fallbacks for the raw-texture sources
TEXTURE_ALIASES = {
    "ender_eye": ["ender_eye"],
    "potion": ["potion"],
    "experience_orb": ["experience_bottle"],
    "xp": ["experience_bottle"],
    "experience": ["experience_bottle"],
    "villager_trades": ["emerald"],
    "looting_iii_sword": ["diamond_sword"],
    "wolves": ["wolf_spawn_egg"],
    "zombies": ["zombie_spawn_egg"],
    "villager": ["villager_spawn_egg"],
    "zombie": ["zombie_spawn_egg"],
    "sheep": ["sheep_spawn_egg"],
    "snow_golem": ["snow_golem_spawn_egg"],
    "shulker": ["shulker_spawn_egg"],
    "chain": ["iron_chain", "chain"],
    "potion_of_fire_resistance": ["potion"],
    "potion_of_invisibility": ["potion"],
    "splash_potion_of_weakness": ["splash_potion"],
    "lava_cauldron": ["cauldron"],
}

SMALL = {"of", "the", "on", "a", "o'", "and", "with"}


def guesses(item_id):
    words = item_id.split("_")
    full = "_".join(w.capitalize() for w in words)
    mixed = "_".join(
        w if (i > 0 and w in SMALL) else w.capitalize() for i, w in enumerate(words)
    )
    out = list(ALIASES.get(item_id, []))
    if item_id in ALIASES and not ALIASES[item_id]:
        return []
    for g in (mixed, full):
        if g not in out:
            out.append(g)
    return out


def http_get(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if e.code == 429:
                time.sleep(5 * (i + 1))
                continue
            time.sleep(1)
        except Exception:
            time.sleep(1)
    return None


def wiki_resolve(names):
    """names: list of wiki names. Returns {name: url} for the ones that exist."""
    found = {}
    names = list(dict.fromkeys(names))
    for start in range(0, len(names), 50):
        chunk = names[start:start + 50]
        titles = "|".join("File:Invicon_%s.png" % n for n in chunk)
        titles_gif = "|".join("File:Invicon_%s.gif" % n for n in chunk)
        for t in (titles, titles_gif):
            params = {
                "action": "query", "titles": t, "prop": "imageinfo",
                "iiprop": "url", "format": "json", "redirects": "1",
            }
            data = http_get(API + "?" + urllib.parse.urlencode(params))
            if not data:
                continue
            q = json.loads(data).get("query", {})
            # map normalized/redirected titles back to the requested names
            back = {}
            for n in q.get("normalized", []):
                back[n["to"]] = n["from"]
            for rd in q.get("redirects", []):
                back[rd["to"]] = back.get(rd["from"], rd["from"])
            for p in q.get("pages", {}).values():
                info = p.get("imageinfo")
                if not info:
                    continue
                title = back.get(p["title"], p["title"])
                name = title.replace("File:Invicon_", "").rsplit(".", 1)[0]
                name = name.replace(" ", "_")
                found.setdefault(name, info[0]["url"])
            time.sleep(0.3)
    return found


def to_icon(raw, size):
    im = Image.open(io.BytesIO(raw))
    im.seek(0)  # first frame of animated GIFs
    im = im.convert("RGBA")
    bbox = im.getbbox()
    if bbox is None:
        return None
    w, h = im.size
    if w != h:  # pad to square, centred
        s = max(w, h)
        sq = Image.new("RGBA", (s, s), (0, 0, 0, 0))
        sq.paste(im, ((s - w) // 2, (s - h) // 2))
        im = sq
    if im.size[0] <= size:
        im = im.resize((size, size), Image.NEAREST)
    else:
        im = im.resize((size, size), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    return buf.getvalue()


PRISMARINE_VERSIONS = ["1.21.8", "1.21.6", "1.21.5", "1.21.4", "1.21.1", "1.20.2"]
INVENTIVE_VERSIONS = ["1.21.10", "1.21.8", "1.21.5", "1.21.4"]


def texture_fallback(item_id):
    names = TEXTURE_ALIASES.get(item_id, []) + [item_id]
    for n in names:
        for v in PRISMARINE_VERSIONS:
            for kind in ("items", "blocks"):
                url = "https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/%s/%s/%s.png" % (v, kind, n)
                raw = http_get(url, tries=1)
                if raw:
                    return raw, "prismarine:%s/%s/%s" % (v, kind, n)
        for v in INVENTIVE_VERSIONS:
            for kind in ("item", "block"):
                url = "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/%s/assets/minecraft/textures/%s/%s.png" % (v, kind, n)
                raw = http_get(url, tries=1)
                if raw:
                    return raw, "inventive:%s/%s/%s" % (v, kind, n)
    return None, None


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    ids_file, out = sys.argv[1], sys.argv[2]
    size = 32
    if "--size" in sys.argv:
        size = int(sys.argv[sys.argv.index("--size") + 1])
    os.makedirs(out, exist_ok=True)
    with open(ids_file, encoding="utf-8") as f:
        ids = [l.strip() for l in f if l.strip() and not l.startswith("#")]
    ids = list(dict.fromkeys(ids))
    todo = [i for i in ids if not os.path.exists(os.path.join(out, i + ".png"))]
    print("%d ids, %d to fetch" % (len(ids), len(todo)))

    cand = {i: guesses(i) for i in todo}
    allnames = [n for c in cand.values() for n in c]
    found = wiki_resolve(allnames)

    sources = {}

    def work(item_id):
        for n in cand[item_id]:
            url = found.get(n)
            if url:
                raw = http_get(url)
                if raw:
                    png = to_icon(raw, size)
                    if png:
                        return item_id, png, "wiki:Invicon_" + n
        raw, src = texture_fallback(item_id)
        if raw:
            png = to_icon(raw, size)
            if png:
                return item_id, png, src
        return item_id, None, None

    with ThreadPoolExecutor(max_workers=4) as ex:
        for item_id, png, src in ex.map(work, todo):
            if png:
                with open(os.path.join(out, item_id + ".png"), "wb") as f:
                    f.write(png)
                sources[item_id] = src
            print("%-40s %s" % (item_id, src or "MISSING"))

    missing = [i for i in ids if not os.path.exists(os.path.join(out, i + ".png"))]
    with open(os.path.join(out, "missing.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(missing) + ("\n" if missing else ""))
    n_wiki = sum(1 for s in sources.values() if s.startswith("wiki"))
    print("fetched %d (wiki %d, textures %d), missing %d"
          % (len(sources), n_wiki, len(sources) - n_wiki, len(missing)))


if __name__ == "__main__":
    main()
