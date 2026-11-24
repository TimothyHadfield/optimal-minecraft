# ianxofour (IanXO4) — complete Minecraft catalogue

Gathered 2026-11-24. Method: pulled the channel's full uploads playlist (250 public videos) via YouTube's own page data and continuation API, then fetched every Minecraft video's watch page for its exact title, publish date and full description. Cross-checked with the channel RSS feed (newest upload = 2024-08-31 UTC, matching). Raw data: `uploads.tsv` (all 250 uploads) and `descs.json` (full descriptions of the 27 Minecraft videos), both in this folder.

## Channel facts
- Channel: https://www.youtube.com/@ianxofour (channel id `UCJisX5g6Vt6vlfqzFE_7jjw`), about 217K subscribers (seen on channel page 2026-11-24).
- About text: "IanXO4 or ianxofour, but you can call me Ian (he/him/his). Ian's Discord Server: https://discord.gg/G9aa2YTTQX" (source: channel page).
- RSS: https://www.youtube.com/feeds/videos.xml?channel_id=UCJisX5g6Vt6vlfqzFE_7jjw
- Uploads playlist: https://www.youtube.com/playlist?list=UUJisX5g6Vt6vlfqzFE_7jjw. Channel playlist "Minecraft Elegance" holds the Minecraft series (source: /@ianxofour/playlists).
- **No website, Patreon, linktree, Shorts or streams found.** The only link on the channel and in every description is the **Discord**. Downloads are hosted on **MediaFire** (often behind tinyurl short links) and screenshots on imgur.
- Out of 250 uploads, **27 are Minecraft** (all titled "Minecraft Elegance: ..."), uploaded 2020-12-23 to 2024-08-30. The other 223 are Bad Piggies, Bloons TD5 and Assassin's Creed videos from 2008-2013. **No new Minecraft video since 2024-08-30.**
- **Edition: every one is Java.** The Iron Farm description says "Does not work on Bedrock Edition", and the Dragon Trap one says "This works only in Java". No Bedrock videos exist.

## Materials: where the lists actually are
- **No description has a full written materials list**, except the Ender Dragon Death Trap. Every other build video has a **"Materials" chapter timestamp** (e.g. "0:24 Materials list"), so the list is shown **on screen in the video** at that time. To record exact materials you have to read that frame (or use the litematic, see below).
- Partial written counts: Iron Farm ("30 easy-to-obtain items need placement"), Guardian ("CORRECTION: 32 hoppers, and 400 scaffolding"), Peer Pressure upgrade ("690 additional nether bricks and 624 buttons"), Obsidian ("plus 1 stair"), Raid ("plus 5 villagers"), Shulker ("plus minecart"), Tree farm ("replace chain with fence post").
- **Best machine-readable source: the Litematica files.** Litematica's in-game Material List (M + menu) gives exact block counts. 9 farms have a litematic link (marked L below). World downloads (W) can also be loaded into Litematica to make a schematic of the farm (inferred).

## The catalogue (27 Minecraft videos, newest first)

Key: **Mat** = what the description says about materials (chapter = on-screen list at that timestamp). **DL**: W = world download, L = litematic, P = picture of a variant. All links point to the farm's YouTube description. Discord link in all 27.

| # | Exact title | URL | Date | Edition / version (from title/desc) | Type | Mat (desc) | DL |
|---|---|---|---|---|---|---|---|
| 1 | Minecraft Elegance: Instant Concrete Factory (Sand, Gravel, Flint, Java 1.21+, 28.8k/hr) | https://www.youtube.com/watch?v=epWigQigG0M | 2024-08-30 | Java 1.21+ | Concrete / sand / gravel / flint duper | chapter 1:52 | W + L (2) |
| 2 | Minecraft Elegance: Practical Concrete Factory (Sand, Gravel, Powder, Flint, Java 1.19+) | https://www.youtube.com/watch?v=BkZz7jNSE7c | 2024-01-20 | Java 1.19+ (desc: use #1 for 1.21+) | Concrete / sand / gravel duper (TNT) | chapter 0:21 | W + L (2) |
| 3 | Minecraft Elegance: Peer Pressure Fortress Farm (Java 1.16.4+*) | https://www.youtube.com/watch?v=jKWp56FmBdI | 2023-10-07 | Java 1.16.4+ | Nether fortress (wither skull, blaze, bone, coal) | chapter 0:25; upgrade counts written | W + L |
| 4 | Minecraft Elegance: Cheap Sheep Wool Farm (Java 1.16.4+) | https://www.youtube.com/watch?v=_gc4n0QFiN8 | 2023-03-10 | Java 1.16.4+ (pre-1.19 note) | Wool | chapter 0:22 | P (18- and 24-sheep pictures) |
| 5 | Minecraft Elegance: Versatile Tree Farm (Universal, Cherry, Nether, & Huge Mushroom; Java 1.16+) | https://www.youtube.com/watch?v=6xe4I4EqnFw | 2022-10-10 | Java 1.16+ (1.20+: fence post not chain) | Tree / fungus / mushroom (TNT) | chapter 0:18 | W + L |
| 6 | Minecraft Elegance: Instant Lazy Mob Switch (Java 1.17+) | https://www.youtube.com/watch?v=EDBesTQW9XM | 2022-08-06 | Java 1.17+ | Utility: mob switch (not a farm) | chapter 0:27 | W (5 designs) |
| 7 | Minecraft Elegance: Next Generation Copper Farm (Java 1.17-1.21.1) | https://www.youtube.com/watch?v=JyHqXBC9W24 | 2022-07-08 | Java 1.17-1.21.1 (1.21+ tweak in desc) | Copper (drowned, zombie reinforcements) | chapter 0:36 | W + L (1.19 collection) |
| 8 | Minecraft Elegance: Instant Obsidian Farm (32k/hr, Java 1.16.5, 1.17+) | https://www.youtube.com/watch?v=m7L_odfKJlc | 2022-06-11 | Java 1.16.5, 1.17+ (1.20.2+ and 1.21.1 fixes in desc) | Obsidian (wither) | chapter 0:19 "plus 1 stair" | W |
| 9 | Minecraft Elegance: Voidless Void Trading (Java 1.17-1.19*) | https://www.youtube.com/watch?v=FGFoCfRaljM | 2022-05-27 | Java 1.17-1.19 (1.19.4+ changed) | Utility: villager trading (not a farm) | no materials chapter | none |
| 10 | Minecraft Elegance: Looting Ghast Farms (up to 7200 tears/h, 9000 gp/h, Java 1.16+*) | https://www.youtube.com/watch?v=FMAKZUyGFX4 | 2022-04-17 | Java 1.16+ (1.19-1.19.2 torch fix) | Ghast (tears, gunpowder) | chapter 0:34; "364 obsidian" for 4-portal | W (4 and 30 portals) + L (2) |
| 11 | Minecraft Elegance: Instant Wither Rose Farm (2900/hr, Java 1.16+) | https://www.youtube.com/watch?v=qtXjPaBMMP8 | 2022-03-19 | Java 1.16+ | Wither rose | chapter 0:36 | none |
| 12 | Minecraft Elegance: Instant Bartering Farm Farm (800k+ dph, Java 1.16+*) | https://www.youtube.com/watch?v=ojydo0MYJr0 | 2022-01-24 | Java 1.16+ (1.19+ fix in desc) | Piglin bartering | chapter 1:00 ("only need 2 scaffolding") | W + L (unloader/sorter) |
| 13 | Minecraft Elegance: Practical Stacking Raid Farm (128k dph, Java 1.16*-1.20, DOES NOT WORK in 1.21) | https://www.youtube.com/watch?v=n3mOlrMGjUg | 2021-12-29 | Java 1.16-1.20, not 1.21 | Raid (stacking) | chapter 0:38 "plus 5 villagers" | W + L |
| 14 | Minecraft Elegance: Instant Guardian XP Farm, No Drain (180k XP/h and 90k drops/h, Java 1.16+*) | https://www.youtube.com/watch?v=dfwsIpmOwd4 | 2021-11-06 | Java 1.16+ | Guardian XP | chapter 0:45 + "CORRECTION: 32 hoppers, and 400 scaffolding" | W |
| 15 | Minecraft Elegance: Instant Shulker Farm ("Methuselah", Java 1.17+) | https://www.youtube.com/watch?v=4KzL5aw4MiE | 2021-09-16 | Java 1.17+ | Shulker | chapter 0:45 "plus minecart" | W + L |
| 16 | Minecraft Elegance: Next-Generation Honey Farms (Java 1.15*, 1.16*, 1.17+) | https://www.youtube.com/watch?v=Yr77PW9OojU | 2021-08-11 | Java 1.15, 1.16, 1.17+ | Honey | no "Materials" chapter found (inferred: shown in video) | L (64 hives) |
| 17 | Minecraft Elegance: Instant Wither Skeleton Farm, No Spawn-proofing 135 skulls/hr (Java 1.16+) | https://www.youtube.com/watch?v=ixGwh1pJb9o | 2021-07-09 | Java 1.16+ | Wither skeleton (superseded by #3) | chapter 0:24 | W (+ fan collection system on Discord) |
| 18 | Minecraft Elegance: Looting Slime Farms, 6000 dph (in Swamp) to 42000 dph (Java 1.16+*) | https://www.youtube.com/watch?v=1t-LvNVuhN0 | 2021-06-11 | Java 1.16+ (1.18+ caveat) | Slime | no "Materials" chapter matched (inferred: shown in video) | W (2: swamp, gnembon edit) |
| 19 | Minecraft Elegance: Instant Gold XP Farm, 360 gold blocks/hour (Java 1.13+*) | https://www.youtube.com/watch?v=uBpMwXVn6iY | 2021-05-14 | Java 1.13+ (1.21+ fix in desc) | Gold / XP (zombified piglin) | chapter 0:35 | W (+ fan collection on Discord) |
| 20 | Minecraft Elegance: Raid Captain Bank, an upgrade to Instant Raid Farm (Java 1.16-1.20) | https://www.youtube.com/watch?v=viRZUhC2_zE | 2021-04-22 | Java 1.16-1.20 | Raid farm add-on | chapter 1:30 | none |
| 21 | Minecraft Elegance: Superfast overworld exploration (2200+ bpm) "Water Skiing" (Java 1.16-1.19) | https://www.youtube.com/watch?v=c9lvHXZ6Rlw | 2021-04-02 | Java 1.16-1.19 | Technique: travel (not a farm) | none | none |
| 22 | Minecraft Elegance: Instant AFK Raid Farm, 3000+ emeralds/hr (Java 1.16-1.20) | https://www.youtube.com/watch?v=hVHFIfZAL54 | 2021-02-25 | Java 1.16-1.20 | Raid (AFK) | chapter 0:34 | W + L (+ Raid_Farm.xml) |
| 23 | Minecraft Elegance: Instant Mob Farm with Scaffolding (Java 1.16-1.19.2*, DOES NOT WORK IN 1.19.3+) | https://www.youtube.com/watch?v=TmqLXovhDOQ | 2021-02-03 | Java 1.16-1.19.2 (1.19.3+: top slabs, per desc) | General mob | chapter 1:08 | W + P |
| 24 | Minecraft Elegance: Instant Trading Hall with Villager Breeder (Java) | https://www.youtube.com/watch?v=aTKJqJEa8Zg | 2021-01-17 | Java (recorded 1.16, works 1.17; 1.20.2 zombie note) | Villager breeder + trading hall | none found | none |
| 25 | Minecraft Elegance: Ender Dragon Death Trap - Simple, Safe, Fast (Java 1.14.2+*) | https://www.youtube.com/watch?v=dxGmt8_Vbgg | 2021-01-08 | Java 1.14.2+ only | Boss kill technique (not a farm) | **written in desc:** "195 dirt blocks, 1 obsidian, 1 water bucket, pickaxe, bow, 80 arrows, optional empty bottles" | none |
| 26 | Minecraft Elegance: Instant Trident Farm (Java 1.16-1.20*) | https://www.youtube.com/watch?v=suu3uay2fDc | 2021-01-02 | Java 1.16-1.20 | Trident (drowned) | chapter 1:55 | none |
| 27 | Minecraft Elegance: Iron Farm on Day 1 of Survival, Java 1.16+ | https://www.youtube.com/watch?v=-oYyJ6jfSPU | 2020-12-23 | Java 1.16+; "Does not work on Bedrock Edition" | Iron | chapter 4:08; "30 easy-to-obtain items need placement" | none (imgur picture only) |

Dates are YouTube's `publishDate` (Pacific time) from each watch page, fetched 2026-11-24.

**Count:** 27 Minecraft videos = **21 farms + 2 farm add-ons/utilities that produce things (Raid Captain Bank, Trading Hall with Villager Breeder) + 4 non-farm techniques** (Lazy Mob Switch, Voidless Void Trading, Water Skiing, Ender Dragon Death Trap). The split is my classification.

## Download links per farm (from descriptions)
- #1 Instant Concrete: W https://www.mediafire.com/file/wpq2mzh3a1fq4zx/IanXO4+Instant+Concrete+Factory.zip/file · L https://www.mediafire.com/file/dl0go1s93b4jevy/IanXO4_Instant_Concrete_Factory-Stronghold.litematic/file · https://www.mediafire.com/file/5112uieyvcgq815/IanXO4_Instant_Concrete_Factory-End.litematic/file
- #2 Practical Concrete: W https://www.mediafire.com/file/iy9blrzu396dpld/IanXO4_Practical_Concrete_Factory.zip/file · L https://www.mediafire.com/file/luqntweinm04vmf/IanXO4_Concrete_Factory_OW.litematic/file · https://www.mediafire.com/file/0s8gm5dsnume8dn/IanXO4_Concrete_Factory_End.litematic/file
- #3 Peer Pressure: W https://tinyurl.com/657hm2ca · L https://tinyurl.com/2e7x7k3z · upgrade https://tinyurl.com/yp9pj773
- #4 Wool: 18-sheep https://www.mediafire.com/view/jc0gcgfk95va68y/IanXO4_Wool_Farm_-_18_Sheep.png/file · 24-sheep https://www.mediafire.com/view/36h2fsu0l72xdp5/Supersized_IanXO4_Wool_Farm.png/file
- #5 Tree: W http://tinyurl.com/52eaxc6r · L (do not rotate) http://tinyurl.com/2d437jvx
- #6 Mob Switch: W https://www.mediafire.com/file/lrb0w9lc6ogaxmh/IanXO4_-_5_Mob_Switches.zip/file
- #7 Copper: W https://www.mediafire.com/file/himk4aozf0n1rj9/IanXO4_Next_Gen_Copper_Farm.zip/file · L (collection, 1.19) https://www.mediafire.com/file/6fzpbj1qisq6l3n/IanXO4_Copper_Farm_Collection_System.litematic/file
- #8 Obsidian: W https://www.mediafire.com/file/ljxsii81yaxh7ev/IanXO4_Obsidian_Farm.zip/file · 1.20.2+ fix https://imgur.com/a/0ZOp9nm
- #10 Ghast: W4 https://tinyurl.com/yc6mxs6k · W30 https://tinyurl.com/y6jz92ca · L https://www.mediafire.com/file/0gl8zkz22f9isez/IanXO4_Ghast_Farm_-_Overworld.litematic/file · https://www.mediafire.com/file/k2xhmp213mkwwn7/IanXO4_Ghast_Farm_-_Nether.litematic/file
- #12 Bartering: W https://www.mediafire.com/file/750flkv2849s2cq/IanXO4_Bartering_Farm_Farm_-_128_Piglins.zip/file · L https://www.mediafire.com/file/bhyw2tyf1a4r235/Bartering_Shulker_Box_Unloader_and_Sorter.litematic/file
- #13 Stacking Raid: W https://tinyurl.com/ysf4vdah · L https://tinyurl.com/mr3ze5vh (more tinyurls in the description)
- #14 Guardian: W https://tinyurl.com/3bn2wshw
- #15 Shulker: L https://tinyurl.com/x7mpzcdf · https://tinyurl.com/ydus2r54 · W https://tinyurl.com/yhbprjjw
- #16 Honey: L https://www.mediafire.com/file/26mn0odw99lpk7e/IanXO4_Next_Gen_Honey_Farm_-_64_hives.litematic/file
- #17 Wither Skeleton: W https://tinyurl.com/2p92tmd4
- #18 Slime: W https://www.mediafire.com/file/tj54wzh8yjwcehc/IanXO4%2527s_Looting_Slime_Farm.zip/file · https://www.mediafire.com/file/nqplm2xhc3r8al4/IanXO4_Looting_Gnembon_Slimefarm.zip/file
- #19 Gold: W https://www.mediafire.com/file/ahlyp62zlrxk72r/IanXO4%2527s_Instant_Gold_XP_Farm.zip/file
- #22 AFK Raid: W http://www.mediafire.com/file/0djexlejv23ar9n/IanXO4%2527s_Instant_AFK_Raid_Farm.zip/file · L http://www.mediafire.com/file/fghlg2gowdvra2p/IanXO4%2527s_Raid_Farm_-_DO_NOT_ROTATE.litematic/file
- #23 Mob Farm: W https://www.mediafire.com/file/8vy7ov0ex9jsvta/IanXO4%2527s_Instant_Mob_Farm_-_Rev1.zip/file

## Fan / third-party sources
- **Discord** https://discord.gg/G9aa2YTTQX (his own server; fan collection systems for the gold and wither-skeleton farms are posted there, per the descriptions). Not checked (needs a login).
- Abfielder sells an "IanXoFour stacking raid farm (With Storage)" schematic with a resource list: https://abfielder.com/Products/ProductDetails.php?id=2253 (seen only in search results; page returned 403 to fetch).
- Vanilla X server docs on his Practical Stacking Raid Farm (server-specific tweak): https://docs.vanillax.net/s/o/doc/raid-farms-QqN8zQggg9 (search result only).
- r/technicalminecraft threads mention his iron and fortress farms (e.g. https://lr.us.psf.lt/r/technicalminecraft/comments/1e3qbic/endgame_farms_for_121 , a Redlib mirror), but **no fan spreadsheet or wiki listing his farms' materials was found** after four web searches (name + materials, + schematic/spreadsheet, + Reddit, + specific farm names).
- Bedrock ports by other creators exist (a Reddit post titled "Bedrock Ianxofour Iron Farm" turned up in search), but none are his.

## NOT verified
- On-screen materials lists were not read (they are inside the videos).
- tinyurl links were not followed to check they still resolve.
- Upload dates are YouTube's publish dates and may differ by a day from local time.
- Unlisted or private videos would not appear in the uploads playlist.
