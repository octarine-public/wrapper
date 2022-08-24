import { DAMAGE_TYPES } from "../Enums/DAMAGE_TYPES"
import { dotaunitorder_t } from "../Enums/dotaunitorder_t"
import { ParseResourceLayout } from "../Resources/ParseResource"
import { Utf16ArrayToStr, Utf8ArrayToStr } from "./ArrayBufferUtils"
import BinaryStream from "./BinaryStream"
import readFile from "./readFile"

export const DamageIgnoreBuffs = [
	[], // DAMAGE_TYPES.DAMAGE_TYPE_NONE = 0
	[ // DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL = 1
		"modifier_item_aeon_disk_buff",
	],
	[ // DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL = 2
		"modifier_life_stealer_rage",
		"modifier_oracle_fates_edict",
		"modifier_medusa_stone_gaze",
		"modifier_juggernaut_blade_fury",
		"modifier_omniknight_repel",
		"modifier_item_aeon_disk_buff",
	],
	[],
	[], // DAMAGE_TYPES.DAMAGE_TYPE_PURE = 4
	[],
	[],
	[ // DAMAGE_TYPES.DAMAGE_TYPE_ALL = 7
		"modifier_abaddon_borrowed_time",
		"modifier_skeleton_king_reincarnation_scepter_active",
		"modifier_brewmaster_primal_split",
		"modifier_phoenix_supernova_hiding",
		"modifier_nyx_assassin_spiked_carapace",
		"modifier_templar_assassin_refraction_absorb",
		"modifier_oracle_false_promise",
		"modifier_dazzle_shallow_grave",
		"modifier_treant_living_armor",
		"modifier_item_aegis",
		"modifier_tusk_snowball_movement",
		"modifier_eul_cyclone",
		"modifier_necrolyte_reapers_scythe",
		"modifier_riki_tricks_of_the_trade_phase",
		"modifier_ember_spirit_sleight_of_fist_caster_invulnerability",
		"modifier_puck_phase_shift",
	],
	[], // DAMAGE_TYPES.DAMAGE_TYPE_HP_REMOVAL = 8
],
	OrdersWithoutSideEffects = [
		dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY,
		dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
		dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO,
		dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM,
		dotaunitorder_t.DOTA_UNIT_ORDER_DISASSEMBLE_ITEM,
		dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK,
		dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM,
		dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
		dotaunitorder_t.DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH,
		dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE, // Announce?
		dotaunitorder_t.DOTA_UNIT_ORDER_GLYPH,
		dotaunitorder_t.DOTA_UNIT_ORDER_RADAR,
	]
DamageIgnoreBuffs.map((ar, i) => { // optimization & beauty trick
	if (i === DAMAGE_TYPES.DAMAGE_TYPE_NONE || i === DAMAGE_TYPES.DAMAGE_TYPE_ALL)
		return ar
	return ar.concat(DamageIgnoreBuffs[DAMAGE_TYPES.DAMAGE_TYPE_ALL])
})

export function parseEnumString(enum_object: any /* { [key: string]: number } */, str: string): number {
	const regex = /(\w+)\s?(\||\&|\+|\-)?/g // it's in variable to preserve RegExp#exec steps
	let last_tok = "",
		res = 0
	while (true) {
		const regex_res = regex.exec(str)
		if (regex_res === null)
			return res
		const parsed_name = (enum_object[regex_res[1]] as number | undefined) ?? 0
		switch (last_tok) {
			case "&":
				res &= parsed_name
				break
			case "|":
				res |= parsed_name
				break
			case "+":
				res += parsed_name
				break
			case "-":
				res -= parsed_name
				break
			default:
				res = parsed_name
				break
		}
		last_tok = regex_res[2] || ""
	}
}

function FixArray(ar: any[]): any {
	return ar.map(v => v instanceof Map ? MapToObject(v) : Array.isArray(v) ? FixArray(v) : v)
}

export function MapToObject(map: Map<any, any>): any {
	const obj: any = {}
	map.forEach((v, k) => obj[k] = v instanceof Map ? MapToObject(v) : Array.isArray(v) ? FixArray(v) : v)
	return obj
}

export function ParseExternalReferences(buf: Uint8Array, recursive = false): Map<bigint, string> {
	const map = new Map<bigint, string>()
	const layout = ParseResourceLayout(buf)
	if (layout === undefined)
		return map

	const RERL = layout[0].get("RERL")
	if (RERL === undefined)
		return map

	const stream = new BinaryStream(new DataView(
		RERL.buffer,
		RERL.byteOffset,
		RERL.byteLength,
	))
	const data_offset = stream.ReadUint32(),
		size = stream.ReadUint32()
	if (size === 0)
		return map

	stream.pos += data_offset - 8 // offset from offset
	for (let i = 0; i < size; i++) {
		const id = stream.ReadUint64()
		const offset = Number(stream.ReadUint64()),
			prev = stream.pos
		stream.pos += offset - 8
		const str = `${stream.ReadNullTerminatedUtf8String()}_c`
		if (fexists(str))
			map.set(id, str)
		stream.pos = prev
	}
	if (recursive) {
		[...map.values()].forEach(path => {
			const read = fread(path)
			if (read !== undefined)
				ParseExternalReferences(read)
					.forEach((val, key) => map.set(key, val))
		})
	}
	return map
}

export function ParseMapName(path: string): Nullable<string> {
	const res = /maps(\/|\\)(.+)\.vpk$/.exec(path)
	if (res === null)
		return undefined

	const map_name = res[2]
	if (map_name.startsWith("scenes") || map_name.startsWith("prefabs")) // that must not be loaded as main map, so we must ignore it
		return undefined
	return map_name
}

export function readJSON(path: string): any {
	const buf = readFile(path, 1)
	if (buf === undefined)
		throw `Failed to read JSON file at path ${path}`
	try {
		return JSON.parse(Utf16ArrayToStr(new Uint16Array(buf.buffer, buf.byteOffset, buf.byteLength / 2)))
	} catch {
		try {
			return JSON.parse(Utf8ArrayToStr(buf))
		} catch {
			throw `invalid JSON at path ${path}`
		}
	}
}

type CompareFunc<T> = (a: T, b: T) => number
function partition<T>(items: T[], cmpFunc: CompareFunc<T>, left: number, right: number) {
	const pivot = items[Math.floor((right + left) / 2)]
	let i = left,
		j = right
	while (i <= j) {
		while (cmpFunc(items[i], pivot) < 0)
			i++
		while (cmpFunc(items[j], pivot) > 0)
			j--
		if (i > j)
			break

		const temp = items[i]
		items[i] = items[j]
		items[j] = temp

		i++
		j--
	}
	return i
}

export function qsort<T>(items: T[], cmpFunc: CompareFunc<T>, left = 0, right = items.length - 1) {
	if (items.length > 1) {
		const index = partition(items, cmpFunc, left, right)
		if (left < index - 1)
			qsort(items, cmpFunc, left, index - 1)
		if (index < right)
			qsort(items, cmpFunc, index, right)
	}
	return items
}

function insertMapElement<K, V>(map: Map<K, V>, k: K, v: V): void {
	if (map.has(k) && v instanceof Map) {
		const prev_val = map.get(k)
		if (prev_val instanceof Map) {
			v.forEach((v2, k2) => insertMapElement(prev_val, k2, v2))
		} else
			map.set(k, v)
	} else
		map.set(k, v)
}

export function createMapFromMergedIterators<K, V>(...iters: IterableIterator<[K, V]>[]): Map<K, V> {
	const map = new Map<K, V>()
	for (const iter of iters)
		for (const [k, v] of iter)
			insertMapElement(map, k, v)
	return map
}

export async function MakeSTRATZRequestWrapper(req: string): Promise<any> {
	const res = await MakeSTRATZRequest(req)
	const stream = new BinaryStream(new DataView(res))
	const status = stream.ReadUint32()
	const str = Utf8ArrayToStr(stream.ReadSlice(stream.Remaining))
	if (status !== 200)
		throw `Got status code ${status}, ${str}`
	const json = JSON.parse(str)
	if (json.errors !== undefined)
		throw `Got errors: ${json.errors}`
	if (json.data === undefined)
		throw `Got nothing: ${json}`
	return json.data
}
