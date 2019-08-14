import { Vector3 } from "../Imports"
import EventsSDK from "../Managers/Events"

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

export const CursorWorldVec: Vector3 = new Vector3()
EventsSDK.on("Update", cmd => cmd.VectorUnderCursor.CopyTo(CursorWorldVec))
