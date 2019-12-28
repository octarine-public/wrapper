
//@ts-nocheck
import { Game, Hero, Menu, Vector3, EntityManager } from "wrapper/Imports"
import { Owner, initItemsTargetMap } from "../Listeners"

class KunkkaHelper {
	// loop-optimizer: KEEP
	public Spots: Vector3[] = [
		new Vector3(-3959.96875, 1293.75, 384),
		new Vector3(1271.53125, -5256.375, 384), // calibrated
		new Vector3(-347.375, -3343.46875, 256), // calibrated
		new Vector3(-4367.71875, 3553.1875, 256), // calibrated
		new Vector3(1213.28125, 3383.34375, 256), // calibrated
		new Vector3(-2487.4375, 4847.375, 256), // calibrated
		new Vector3(-2664.1875, -528.28125, 256),
		new Vector3(-1828.3125, 4413.78125, 384),
		new Vector3(2124.75, -336, 256),
		new Vector3(4213.1875, -286.625, 384),
		new Vector3(4851.40625, -4262.03125, 256)
	]
	private ModifierCanCastAbility: string[] = [
		"modifier_bashed",
		"modifier_eul_cyclone",
		"modifier_obsidian_destroyer_astral_imprisonment_prison",
		"modifier_shadow_demon_disruption",
		"modifier_invoker_tornado",
		"modifier_legion_commander_duel",
		"modifier_axe_berserkers_call",
		"modifier_winter_wyvern_winters_curse",
		"modifier_bane_fiends_grip",
		"modifier_bane_nightmare",
		"modifier_faceless_void_chronosphere_freeze",
		"modifier_enigma_black_hole_pull",
		"modifier_magnataur_reverse_polarity",
		"modifier_pudge_dismember",
		"modifier_shadow_shaman_shackles",
		"modifier_techies_stasis_trap_stunned",
		"modifier_storm_spirit_electric_vortex_pull",
		"modifier_tidehunter_ravage",
		"modifier_windrunner_shackle_shot",
		"modifier_item_nullifier_mute",
	]
	private CancelModifiers: string[] = [
		"modifier_item_blade_mail_reflect",
		"modifier_item_combo_breaker_buff",
		"modifier_winter_wyvern_winters_curse_aura",
		"modifier_winter_wyvern_winters_curse",
		"modifier_oracle_fates_edict",
	]
	private CancelModifiersItems: string[] = [
		"modifier_item_lotus_orb_active",
	]

	public get DeadInSide(): boolean {
		let Heroes = EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
		return Heroes.length === 0
			|| Owner === undefined
			|| !Heroes.some(x => x.IsAlive && !x.IsInvulnerable)
			|| !Owner.IsAlive
	}
	public get CanCastSpells(): boolean {
		return !(Owner.IsStunned || Owner.IsHexed || Owner.ModifiersBook.HasAnyBuffByNames(this.ModifierCanCastAbility))
	}
	public IsRestrictions(State: Menu.Toggle) {
		return State.value && !Game.IsPaused && Game.IsInGame && Owner !== undefined && Owner.IsAlive
	}
	public Cancel(target: Hero): boolean {
		return !target.IsInvulnerable && !target.ModifiersBook.GetAnyBuffByNames(this.CancelModifiers)
	}
	public CancelItems(target: Hero): boolean {
		return !target.IsMagicImmune && !target.IsInvulnerable && !target.ModifiersBook.GetAnyBuffByNames(this.CancelModifiersItems)
	}
	public IsLinkensProtected(target: Hero): boolean {
		let Items = initItemsTargetMap.get(target)
		if (Items === undefined)
			return false

		return target.HasBuffByName("modifier_item_sphere_target") || (Items.Sphere !== undefined && Items.Sphere.Cooldown === 0)
	}
	public IsBlockingAbilities(target: Hero, checkReflecting: boolean = false): boolean {
		return this.IsLinkensProtected(target) || (checkReflecting && target.HasBuffByName("modifier_item_lotus_orb_active"))
	}
}
export let Base = new KunkkaHelper()
