import { RendererSDK } from "../Imports"
import EventsSDK from "../Managers/EventsSDK"
import ProjectileManager from "../Managers/ProjectileManager"
import Unit from "../Objects/Base/Unit"
import { parseKV } from "./ParseKV"
import { dotaunitorder_t } from "../Enums/dotaunitorder_t"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"

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
	projectile_speeds = {
		npc_dota_hero_bane: 900,
		npc_dota_hero_crystal_maiden: 900,
		npc_dota_hero_drow_ranger: 1250,
		npc_dota_hero_mirana: 900,
		npc_dota_hero_nevermore: 1200,
		npc_dota_hero_morphling: 1300,
		npc_dota_hero_puck: 900,
		npc_dota_hero_razor: 2000,
		npc_dota_hero_storm_spirit: 1100,
		npc_dota_hero_vengefulspirit: 1500,
		npc_dota_hero_windrunner: 1250,
		npc_dota_hero_zuus: 1100,
		npc_dota_hero_lina: 1000,
		npc_dota_hero_lich: 900,
		npc_dota_hero_lion: 900,
		npc_dota_hero_shadow_shaman: 900,
		npc_dota_hero_witch_doctor: 1200,
		npc_dota_hero_enigma: 900,
		npc_dota_hero_tinker: 900,
		npc_dota_hero_sniper: 3000,
		npc_dota_hero_necrolyte: 900,
		npc_dota_hero_warlock: 1200,
		npc_dota_hero_queenofpain: 1500,
		npc_dota_hero_venomancer: 900,
		npc_dota_hero_death_prophet: 1000,
		npc_dota_hero_pugna: 900,
		npc_dota_hero_templar_assassin: 900,
		npc_dota_hero_viper: 1200,
		npc_dota_hero_luna: 900,
		npc_dota_hero_dragon_knight: 900,
		npc_dota_hero_dazzle: 1200,
		npc_dota_hero_leshrac: 900,
		npc_dota_hero_furion: 1125,
		npc_dota_hero_clinkz: 900,
		npc_dota_hero_enchantress: 900,
		npc_dota_hero_huskar: 1400,
		npc_dota_hero_weaver: 900,
		npc_dota_hero_jakiro: 1100,
		npc_dota_hero_batrider: 900,
		npc_dota_hero_chen: 1100,
		npc_dota_hero_ancient_apparition: 1250,
		npc_dota_hero_gyrocopter: 3000,
		npc_dota_hero_invoker: 900,
		npc_dota_hero_silencer: 1000,
		npc_dota_hero_obsidian_destroyer: 900,
		npc_dota_hero_shadow_demon: 900,
		npc_dota_hero_lone_druid: 900,
		npc_dota_hero_rubick: 1125,
		npc_dota_hero_disruptor: 1200,
		npc_dota_hero_keeper_of_the_light: 900,
		npc_dota_hero_wisp: 1200,
		npc_dota_hero_visage: 900,
		npc_dota_hero_medusa: 1200,
		npc_dota_hero_troll_warlord: 1200,
		npc_dota_hero_skywrath_mage: 1000,
		npc_dota_hero_terrorblade: 900,
		npc_dota_hero_phoenix: 1100,
		npc_dota_hero_oracle: 900,
		npc_dota_hero_techies: 900,
		npc_dota_hero_target_dummy: 900,
		npc_dota_hero_winter_wyvern: 700,
		npc_dota_hero_arc_warden: 900,
		npc_dota_hero_dark_willow: 1200,
		npc_dota_hero_grimstroke: 900,
	},
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

export function Utf8ArrayToStr(array: Uint8Array): string {
	var out = ""

	for (let i = 0, end = array.byteLength, c = array[i], char2, char3; i < end; i++ , c = array[i])
		switch (c >> 4) {
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
	return new Map<string, string>(Object.entries(parsed[Object.keys(parsed).find(key => key !== "values" && key !== "comments")]))
}

export function GetHealthAfter(unit: Unit, delay: number, allow_overflow = false, include_projectiles: boolean = false, attacker?: Unit, melee_time_offset: number = 0): number {
	let hpafter = unit.HP/*,
		cur_time = Game.RawGameTime
	// loop-optimizer: KEEP
	attacks.forEach(([end_time, end_time_2, attack_target], attacker_ent) => {
		if (attacker_ent !== attacker && attack_target === unit) {
			let end_time_delta = end_time - (cur_time + delay + melee_time_offset),
				dmg = attacker_ent.AttackDamage(unit)
			if (end_time_delta <= 0 && end_time_delta >= -melee_end_time_delta)
				hpafter -= dmg
			let end_time_2_delta = end_time_2 - (cur_time + delay + melee_time_offset)
			if (end_time_2_delta <= 0 && end_time_2_delta >= -melee_end_time_delta)
				hpafter -= dmg
		}
	})*/
	if (include_projectiles)
		ProjectileManager.AllTrackingProjectiles.forEach(proj => {
			let source = proj.Source
			if (
				proj.Target === unit
				&& source instanceof Unit
				&& proj.IsAttack
				&& !proj.IsDodged
				&& (proj.Position.Distance(proj.TargetLoc) / proj.Speed) <= delay
			)
				hpafter -= unit.AttackDamage(source)
		})
	hpafter += unit.HPRegen * delay
	return Math.max(allow_overflow ? hpafter : Math.min(hpafter, unit.MaxHP), 0)
}

export function GetProportionalScaledVector(vec: Vector2, apply_screen_scaling = true, magic: number = 1, parent_size: Vector2 = RendererSDK.WindowSize): Vector2 {
	vec = vec.Clone()
	let h = parent_size.y
	vec.y = Math.floor(h / 0x300 * vec.y / magic)
	if (apply_screen_scaling && parent_size.x === 1280 && h === 1024)
		h = 960
	vec.x = Math.floor(h / 0x300 * vec.x / magic)
	return vec
}

export const CursorWorldVec: Vector3 = new Vector3()
EventsSDK.on("Update", cmd => cmd.VectorUnderCursor.CopyTo(CursorWorldVec))
