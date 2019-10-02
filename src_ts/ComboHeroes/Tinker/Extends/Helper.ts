import { EntityManager, Game, Hero, Menu, Ability as AbilitySDK } from "wrapper/Imports"
import { Heroes, MyHero } from "../Listeners"

import InitItems from "./Items"

class BaseHelper {
	private PermitPressing: boolean
	public readonly SleepTimeDefualt = 30; // tick
	
	constructor() {
		this.PermitPressing = false
	}

	public set SetPermitPressing(Set: boolean) {
		this.PermitPressing = Set
	}

	public get GetPermitPressing() {
		return this.PermitPressing
	}

	public IsRestrictions(State: Menu.Toggle) {
		if (!this.IsSpectator && State.value && !Game.IsPaused && Game.IsInGame && MyHero !== undefined && MyHero.IsAlive)
		return !this.IsSpectator && State.value && !Game.IsPaused && Game.IsInGame && MyHero !== undefined && MyHero.IsAlive
	}

	public get DeadInSide(): boolean {
		return Heroes.length === 0
			|| MyHero === undefined
			//|| !Heroes.some(x => x.IsEnemy() && x.IsAlive)
			|| !MyHero.IsAlive
	}

	public Active(target: Hero): boolean {

		var borrowedTime = target.GetAbilityByName("abaddon_borrowed_time")
		if (borrowedTime !== undefined && borrowedTime.Owner.HP <= 2000 && borrowedTime.Cooldown <= 0 && borrowedTime.Level > 0) {
			return false
		}

		if (target.ModifiersBook.HasAnyBuffByNames(["modifier_dazzle_shallow_grave", "modifier_spirit_breaker_charge_of_darkness", "modifier_pugna_nether_ward_aura"])) {
			return false
		}

		if (target.AbilitiesBook.Spells.some(x => x !== undefined && x.IsValid && !x.IsHidden && this.ActiveAbilities.includes(x.Name) && x.IsInAbilityPhase)) {
			return true
		}

		// TODO
		//var stunDebuff = target.Modifiers.some(x => x.IsStunDebuff && x.Duration > 1);
		return target.Speed < 240 /*|| stunDebuff*/	|| target.ModifiersBook.HasAnyBuffByNames(this.ActiveModifiers)
	}
	public CanReflectDamage(x: Hero): boolean {
		{
			if (x.ModifiersBook.HasAnyBuffByNames(["modifier_item_blade_mail_reflect","modifier_nyx_assassin_spiked_carapace","modifier_item_lotus_orb_active"]))
			{
				return true;
			}
			return false;
		}
	}
	public Disable(target: Hero): boolean {
		return target.AbilitiesBook.Spells.some(x =>
			x !== undefined
			&& x.IsValid
			&& !x.IsHidden
			&& this.AbilityDisable.includes(x.Name)
			&& x.IsInAbilityPhase,
		)
	}

	public DuelAghanimsScepter(target: Hero): boolean {
		return target.HasModifier("modifier_legion_commander_duel")
			&& Heroes.some(x =>
				!x.IsEnemy()
				&& x.Name === "npc_dota_hero_legion_commander"
				&& x.IsValid
				&& x.IsVisible
				&& x.IsAlive
				&& x.HasScepter,
			)
	}

	public Cancel(target: Hero) {
		return !target.IsMagicImmune
			&& !target.IsInvulnerable
			&& !this.DuelAghanimsScepter(target)
			&& !target.ModifiersBook.HasAnyBuffByNames(this.CancelModifiers)
	}


	public IsLinkensProtected(target: Hero): boolean {
		let Items = new InitItems(target)
		return Items.Sphere !== undefined ? Items.Sphere.Cooldown <= 0 : target.HasModifier("modifier_item_sphere_target")
	}
	public IsLotusProtected(target: Hero): boolean {
		let Items = new InitItems(target)
		return Items.LotusOrb !== undefined ? Items.LotusOrb.Cooldown <= 0 : target.HasModifier("modifier_item_lotus_orb_active")
	}

	public TriggerAutoCombo(target: Hero): boolean {
		return target.ModifiersBook.HasAnyBuffByNames(this.ModifiersTrigger) || target.IsEthereal || target.IsHexed
	}
	
	public ComboBreaker(target: Hero, menu: boolean = true): boolean {
		let Items = new InitItems(target)
		if (Items.AeonDisk !== undefined && Items.AeonDisk.Cooldown <= 0) {
			return true
		}
		return false
	}	

	private get IsSpectator(): boolean {
		let LocalPlayer = EntityManager.LocalPlayer
		return LocalPlayer !== undefined && LocalPlayer.Team === 1
	}
	
	private readonly AbilityDisable: string[] = [
		"queenofpain_blink",
		"antimage_blink",
		"antimage_mana_void",
		"legion_commander_duel",
		"doom_bringer_doom",
		"faceless_void_time_walk",
		"faceless_void_chronosphere",
		"witch_doctor_death_ward",
		"rattletrap_power_cogs",
		"tidehunter_ravage",
		"axe_berserkers_call",
		"brewmaster_primal_split",
		"omniknight_guardian_angel",
		"queenofpain_sonic_wave",
		"slardar_slithereen_crush",
		"lion_finger_of_death",
		"lina_laguna_blade",
		"sven_storm_bolt",
		"pudge_dismember",
	]

	private readonly ActiveAbilities: string[] = [
		"rattletrap_power_cogs",
		"enigma_black_hole",
		"bane_fiends_grip",
		"witch_doctor_death_ward",
	]

	public readonly ActiveModifiers: string[] = [
		"modifier_skywrath_mystic_flare_aura_effect",
		"modifier_rod_of_atos_debuff",
		"modifier_crystal_maiden_frostbite",
		"modifier_crystal_maiden_freezing_field",
		"modifier_naga_siren_ensnare",
		"modifier_meepo_earthbind",
		"modifier_lone_druid_spirit_bear_entangle_effect",
		"modifier_legion_commander_duel",
		"modifier_kunkka_torrent",
		"modifier_enigma_black_hole_pull",
		"modifier_ember_spirit_searing_chains",
		"modifier_dark_troll_warlord_ensnare",
		"modifier_rattletrap_cog_marker",
		"modifier_axe_berserkers_call",
		"modifier_faceless_void_chronosphere_freeze",
		"modifier_winter_wyvern_cold_embrace",
	]

	private readonly CancelModifiers: string[] = [
		"modifier_abaddon_borrowed_time",
		"modifier_item_combo_breaker_buff",
		"modifier_winter_wyvern_winters_curse_aura",
		"modifier_winter_wyvern_winters_curse",
		"modifier_oracle_fates_edict",
		"modifier_antimage_counterspell",
		"modifier_nyx_assassin_spiked_carapace"
	]

	private readonly ModifiersTrigger: string[] = [
		"modifier_rod_of_atos_debuff",
		"modifier_skywrath_mage_concussive_shot_slow",
		"modifier_skywrath_mage_ancient_seal",
	]
}
export let Base = new BaseHelper()