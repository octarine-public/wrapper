
import { Game, Hero, Menu, Vector3 } from "wrapper/Imports"
import { Heroes, Owner } from "../Listeners"
import InitItems from "./Items"

class KunkkaHelper {
	// loop-optimizer: KEEP
	public Spots: Vector3[] = [
		new Vector3(4205.449707, -399.444458, 384.000000),
		new Vector3(-2533.218750, -552.533875, 385.125000), // calibrated
		new Vector3(-1865.487549, 4438.296875, 386.390900), // calibrated
		new Vector3(2546.226563, 41.390625, 384.000000), // calibrated
		new Vector3(-4255.669922, 3469.897461, 256.000000), // calibrated
		new Vector3(-255.859379, -3266.130127, 384.000000), // calibrated
		new Vector3(424.332947, -4665.735352, 396.747070), // calibrated
		new Vector3(-3744.976563, 853.449219, 385.992188), // calibrated
	]
	public IsRestrictions(State: Menu.Toggle) {
		return State.value && !Game.IsPaused && Game.IsInGame && Owner !== undefined && Owner.IsAlive
	}
	public CanCastSpells(Owner: Hero): boolean  {
		return Owner.IsStunned || Owner.IsHexed || Owner.ModifiersBook.HasAnyBuffByNames(this.ModifierCanCastAbility)
	}

	public get DeadInSide(): boolean {
		return Heroes.length === 0
			|| Owner === undefined
			|| !Heroes.some(x => x.IsEnemy() && x.IsAlive && !x.IsInvulnerable)
			|| !Owner.IsAlive
	}
	public Cancel(target: Hero): boolean {
		return !target.IsInvulnerable && !target.ModifiersBook.GetAnyBuffByNames(this.CancelModifiers);
	}
	public CancelItems(target: Hero): boolean {
		return !target.IsMagicImmune && !target.IsInvulnerable && !target.ModifiersBook.GetAnyBuffByNames(this.CancelModifiersItems);
	}
	public IsLinkensProtected(target: Hero): boolean {
		let Items = new InitItems(target)
		return target.HasModifier("modifier_item_sphere_target") || (Items.Sphere !== undefined && Items.Sphere.Cooldown === 0)
	}
	public IsBlockingAbilities(target: Hero, checkReflecting: boolean = false): boolean {
		if (checkReflecting && target.HasModifier("modifier_item_lotus_orb_active")) {
			return true
		}

		if (this.IsLinkensProtected(target)) {
			return true
		}
		// todo qop talent somehow ?
		return false
	}
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
}
export let Base = new KunkkaHelper()