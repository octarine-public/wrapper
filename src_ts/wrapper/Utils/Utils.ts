import { Vector3 } from "../Imports"
import EventsSDK from "../Managers/Events"
import { parseKV } from "./ParseKV"

let masksBigInt: Array<bigint> = new Array(64),
	masksNumber: number[] = new Array(64)

for (let i = 64; i--; )
	masksBigInt[i] = 1n << BigInt(i)

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
]
DamageIgnoreBuffs.map((ar, i) => { // optimization & beauty trick
	if (i === DAMAGE_TYPES.DAMAGE_TYPE_NONE || i === DAMAGE_TYPES.DAMAGE_TYPE_ALL)
		return ar
	return ar.concat(DamageIgnoreBuffs[DAMAGE_TYPES.DAMAGE_TYPE_ALL])
})

for (let i = 64; i--; )
	masksNumber[i] = 1 << i

export function MaskToArrayBigInt(num: bigint): number[] {
	return masksBigInt.map(mask => Number(num & mask)).filter(masked => masked !== 0)
}

export function MaskToArrayNumber(num: number): number[] {
	return masksNumber.map(mask => num & mask).filter(masked => masked !== 0)
}

export function HasBit(num: number, bit: number): boolean {
	return ((num >> bit) & 1) === 1
}
export function HasBitBigInt(num: bigint, bit: bigint): boolean {
	return ((num >> bit) & 1n) === 1n
}
export function HasMask(num: number, mask: number): boolean {
	return (num & mask) === mask
}
export function HasMaskBigInt(num: bigint, mask: bigint): boolean {
	return (num & mask) === mask
}

export function Utf8ArrayToStr(array: Uint8Array): string {
	var out = ""

	for (let i = 0, end = array.byteLength, c = array[i], char2, char3; i < end; i++, c = array[i])
		switch(c >> 4) {
		case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			// 0xxxxxxx
			out += String.fromCharCode(c)
			break
		case 12: case 13:
			// 110x xxxx   10xx xxxx
			char2 = array[i++]
			out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
			break
		case 14:
			// 1110 xxxx  10xx xxxx  10xx xxxx
			char2 = array[i++]
			char3 = array[i++]
			out += String.fromCharCode(((c & 0x0F) << 12) |
						((char2 & 0x3F) << 6) |
						((char3 & 0x3F) << 0))
			break
		}

	return out
}

export function parseKVFile(path: string) {
	let buf = readFile(path)
	if (buf === undefined)
		return undefined
	return parseKV(Utf8ArrayToStr(new Uint8Array(buf)))
}

export function parseKVFileToMap(path: string): Map<string, any> {
	let parsed = parseKVFile(path)
	if (parsed === undefined)
		return undefined
	console.log(Object.keys(parsed))
	return new Map<string, string>(Object.entries(parsed[Object.keys(parsed).find(key => key !== "values" && key !== "comments")]))
}

export const CursorWorldVec: Vector3 = new Vector3()
EventsSDK.on("Update", cmd => cmd.VectorUnderCursor.CopyTo(CursorWorldVec))
