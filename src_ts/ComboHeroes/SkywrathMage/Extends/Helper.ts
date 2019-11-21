import { Game, Hero, Menu } from "wrapper/Imports"
import { Heroes, MyHero, initAbilityMap, initItemsMap, initItemsTargetMap } from "../Listeners"
import { AbilityMenu, BadUltItem, BadUltMovementSpeedItem, ComboBreak, ComboStartWith, Items as ItemsSDK, SmartConShotOnlyTarget } from "../Menu"

class BaseHelper {
	public readonly Tick: number = 100
	private PermitPressing: boolean
	private readonly AbilityDisable: string[] = [
		"queenofpain_blink",
		"monkey_king_boundless_strike",
		"monkey_king_wukongs_command",
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

	private readonly ActiveModifiers: string[] = [
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
		"modifier_item_lotus_orb_active",
		"modifier_antimage_counterspell",
	]

	private readonly ModifiersTrigger: string[] = [
		"modifier_rod_of_atos_debuff",
		"modifier_skywrath_mage_concussive_shot_slow",
		"modifier_skywrath_mage_ancient_seal",
	]
	constructor() {
		this.PermitPressing = false
	}

	public set SetPermitPressing(Set: boolean) {
		this.PermitPressing = Set
	}

	public get GetPermitPressing() {
		return this.PermitPressing
	}

	public get DeadInSide(): boolean {
		return Heroes.length === 0
			|| MyHero === undefined
			|| !Heroes.some(x => x !== undefined && x.IsEnemy() && x.IsAlive && !x.IsInvulnerable)
			|| !MyHero.IsAlive
	}

	public IsRestrictions(State: Menu.Toggle) {
		return State.value && !Game.IsPaused && Game.IsInGame && MyHero !== undefined && MyHero.IsAlive
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
		return target.Speed < 240 /*|| stunDebuff*/
			|| target.ModifiersBook.HasAnyBuffByNames(this.ActiveModifiers)
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
		return target.HasBuffByName("modifier_legion_commander_duel")
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
	public CancelAbilityRealm(target: Hero): boolean {
		return target.HasBuffByName("modifier_dark_willow_shadow_realm_buff")
	}
	public StartCombo(target: Hero): boolean {
		if (!ComboStartWith.value) {
			return true
		}
		let Items = initItemsMap.get(MyHero),
			Abilities = initAbilityMap.get(MyHero)
		if (Items === undefined || Abilities === undefined) {
			return false
		}
		if (Items.Sheeps !== undefined
			&& ItemsSDK.IsEnabled(Items.Sheeps.Name)
			&& Items.Sheeps.CanBeCasted()
			&& MyHero.Distance2D(target) <= Items.Sheeps.CastRange) {
			return true
		} else if (
			AbilityMenu.IsEnabled(Abilities.AncientSeal.Name)
			&& Abilities.AncientSeal.CanBeCasted()
			&& MyHero.Distance2D(target) > Abilities.AncientSeal.CastRange
		) {
			return false
		}

		return true
	}

	public IsLinkensProtected(target: Hero): boolean {
		let Items = initItemsTargetMap.get(target)
		if (Items === undefined) {
			return false
		}
		return target.HasBuffByName("modifier_item_sphere_target") || (Items.Sphere !== undefined && Items.Sphere.Cooldown === 0)
	}

	public BadUlt(target: Hero): boolean {
		if (!BadUltItem.value) {
			return false
		}
		let Items = initItemsTargetMap.get(target)
		if (Items === undefined || Items.RodofAtos !== undefined || Items.Sheeps !== undefined || Items.Ethereal !== undefined) {
			return false
		}

		if (target.Speed < BadUltMovementSpeedItem.value) {
			return true
		}

		return false
	}

	public TriggerAutoCombo(target: Hero): boolean {
		return target.ModifiersBook.HasAnyBuffByNames(this.ModifiersTrigger) || target.IsEthereal || target.IsHexed
	}

	public ConcussiveShotTarget(target: Hero, targetHit: Hero): boolean {
		if (!SmartConShotOnlyTarget.value) {
			return true
		}

		if (targetHit === undefined) {
			return false
		}

		if (target === targetHit) {
			return true
		}

		if (target.Distance2D(targetHit) < 200) {
			return true
		}

		return false
	}

	public AeonDisc(target: Hero, menu: boolean = true): boolean {
		if (!ComboBreak.value && menu) {
			return false
		}
		let Items = initItemsTargetMap.get(target)
		if (Items !== undefined && Items.AeonDisk !== undefined && Items.AeonDisk.Cooldown <= 0) {
			return true
		}

		return false
	}
}
export let Base = new BaseHelper()