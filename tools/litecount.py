"""Count the materials in a Litematica .litematic file (no installs; own NBT reader).
Usage: python -I litecount.py file.litematic [--json]
Prints block counts per region and in total, converted to items the way a player would gather them
(double slabs = 2, door/bed/tall-plant halves counted once, water/lava source = bucket, air skipped),
plus entities (villagers, minecarts, item frames ...)."""
import gzip, struct, sys, json, math
from collections import Counter

def read_nbt(b):
    pos = [0]
    def r(n):
        v = b[pos[0]:pos[0]+n]; pos[0] += n; return v
    def s():
        (n,) = struct.unpack('>H', r(2)); return r(n).decode('utf-8', 'replace')
    def payload(t):
        if t == 1: return struct.unpack('>b', r(1))[0]
        if t == 2: return struct.unpack('>h', r(2))[0]
        if t == 3: return struct.unpack('>i', r(4))[0]
        if t == 4: return struct.unpack('>q', r(8))[0]
        if t == 5: return struct.unpack('>f', r(4))[0]
        if t == 6: return struct.unpack('>d', r(8))[0]
        if t == 7:
            (n,) = struct.unpack('>i', r(4)); return r(n)
        if t == 8: return s()
        if t == 9:
            et = r(1)[0]; (n,) = struct.unpack('>i', r(4)); return [payload(et) for _ in range(n)]
        if t == 10:
            d = {}
            while True:
                tt = r(1)[0]
                if tt == 0: return d
                k = s(); d[k] = payload(tt)
        if t == 11:
            (n,) = struct.unpack('>i', r(4)); return list(struct.unpack('>%di' % n, r(4*n)))
        if t == 12:
            (n,) = struct.unpack('>i', r(4)); return list(struct.unpack('>%dq' % n, r(8*n)))
        raise ValueError('bad tag %d' % t)
    t = r(1)[0]; s(); return payload(t)

HALVES = ('_door', '_bed')
TALL = {'tall_grass', 'large_fern', 'sunflower', 'lilac', 'rose_bush', 'peony', 'pitcher_plant', 'tall_seagrass'}

def item_of(name, props):
    n = name.replace('minecraft:', '')
    if n in ('air', 'cave_air', 'void_air', 'moving_piston', 'piston_head', 'bubble_column', 'fire', 'soul_fire', 'nether_portal', 'end_portal'):
        return None, 0
    if n == 'water': return ('water_bucket', 1) if props.get('level', '0') == '0' else (None, 0)
    if n == 'lava': return ('lava_bucket', 1) if props.get('level', '0') == '0' else (None, 0)
    if n.endswith('_slab') and props.get('type') == 'double': return n, 2
    if n.endswith(HALVES):
        keep = props.get('half', props.get('part')) in ('lower', 'foot')
        return (n, 1) if keep else (None, 0)
    if n in TALL: return (n, 1) if props.get('half') == 'lower' else (None, 0)
    if n == 'redstone_wire': return 'redstone', 1
    if n == 'tripwire': return 'string', 1
    if n.startswith('wall_') or '_wall_' in n and ('torch' in n or 'sign' in n or 'banner' in n or 'head' in n or 'skull' in n):
        n = n.replace('wall_', '')
    if n in ('candle',) and 'candles' in props: return n, int(props['candles'])
    if n == 'sea_pickle': return n, int(props.get('pickles', 1))
    if n == 'snow': return n, int(props.get('layers', 1))
    return n, 1

def count(path):
    root = read_nbt(gzip.open(path).read())
    out = {'regions': {}, 'total': Counter(), 'entities': Counter(), 'raw_states': Counter()}
    for rname, reg in root['Regions'].items():
        pal = reg['BlockStatePalette']; sz = reg['Size']
        vol = abs(sz['x']) * abs(sz['y']) * abs(sz['z'])
        bits = max(2, math.ceil(math.log2(len(pal)))) if len(pal) > 1 else 2
        longs = [x & 0xFFFFFFFFFFFFFFFF for x in reg['BlockStates']]
        mask = (1 << bits) - 1
        idx = Counter()
        for i in range(vol):
            start = i * bits; li = start >> 6; off = start & 63
            v = longs[li] >> off
            if off + bits > 64: v |= longs[li + 1] << (64 - off)
            idx[v & mask] += 1
        rc = Counter()
        for k, c in idx.items():
            e = pal[k]; nm = e['Name']; pr = e.get('Properties', {})
            out['raw_states'][nm.replace('minecraft:', '')] += c
            it, mult = item_of(nm, pr)
            if it: rc[it] += c * mult
        for ent in reg.get('Entities', []):
            out['entities'][str(ent.get('id', '?')).replace('minecraft:', '')] += 1
        out['regions'][rname] = {'size': [sz['x'], sz['y'], sz['z']], 'items': dict(rc.most_common())}
        out['total'].update(rc)
    md = root.get('Metadata', {})
    out['meta'] = {k: md.get(k) for k in ('Name', 'Author', 'TotalBlocks', 'TotalVolume') if k in md}
    out['version'] = {'MinecraftDataVersion': root.get('MinecraftDataVersion'), 'Version': root.get('Version')}
    return out

if __name__ == '__main__':
    o = count(sys.argv[1])
    if '--json' in sys.argv:
        print(json.dumps({'meta': o['meta'], 'version': o['version'], 'total': dict(o['total'].most_common()),
                          'entities': dict(o['entities']), 'regions': o['regions']}, indent=1))
    else:
        print('meta', o['meta'], o['version'])
        for n, c in o['total'].most_common():
            print('%6d  %-32s (%s stacks)' % (c, n, round(c / 64, 1)))
        if o['entities']: print('entities', dict(o['entities']))
