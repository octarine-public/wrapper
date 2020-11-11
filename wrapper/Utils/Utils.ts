import { parseKV } from "./ParseKV"
import { dotaunitorder_t } from "../Enums/dotaunitorder_t"
import { ExtractResourceBlock } from "../Native/WASM"
import BinaryStream from "./BinaryStream"
import readFile from "./readFile"
import { Utf16ArrayToStr, Utf8ArrayToStr } from "./ArrayBufferUtils"

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

export function parseKVFile(path: string): RecursiveMap {
	const buf = readFile(path)
	return buf !== undefined ? parseKV(new Uint8Array(buf)) : new Map()
}

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

export function ParseExternalReferences(buf: Uint8Array): string[] {
	const RERL = ExtractResourceBlock(buf, "RERL")
	if (RERL === undefined)
		return []

	const stream = new BinaryStream(new DataView(buf.buffer, buf.byteOffset + RERL[0], RERL[1]))
	const data_offset = stream.ReadUint32(),
		size = stream.ReadUint32()
	if (size === 0)
		return []

	stream.pos += data_offset - 8 // offset from offset
	let list: string[] = []
	for (let i = 0; i < size; i++) {
		stream.RelativeSeek(8) // ResourceReferenceInfo.ID
		const offset = Number(stream.ReadUint64()),
			prev = stream.pos
		stream.pos += offset - 8
		const str = stream.ReadNullTerminatedUtf8String()
		if (str.endsWith("vrman")) {
			const read = fread(str + "_c")
			if (read !== undefined)
				list = [...list, ...ParseExternalReferences(new Uint8Array(read))]
		} else
			list.push(str)
		stream.pos = prev
	}
	return list
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
	const buf = fread(path)
	if (buf === undefined)
		throw `Failed to read JSON file at path ${path}`
	try {
		return JSON.parse(Utf16ArrayToStr(new Uint16Array(buf)))
	} catch {
		try {
			return JSON.parse(Utf8ArrayToStr(new Uint8Array(buf)))
		} catch {
			throw `invalid JSON at path ${path}`
		}
	}
}
