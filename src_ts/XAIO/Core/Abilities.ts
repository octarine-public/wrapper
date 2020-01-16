import {
	Menu,
	Item,
	Hero,
	Unit,
	Ability,
	Vector3,
	EventsSDK,
	item_sphere,
	EntityManager,
	TickSleeper,
	GameSleeper,
	antimage_spell_shield
} from "wrapper/Imports"

import { Sleeper, XAIOGame } from "./bootstrap"

let GameData = new XAIOGame()

let SleepTick = new TickSleeper() 		// tick ms
let ActionSleeper = new Sleeper() 		// sleep sec
let AbilitySleep = new GameSleeper() 	// sleep name

export default class AbilitiesHelper {

	private readonly CancelModifiers: string[] = [
		"modifier_abaddon_borrowed_time",
		"modifier_item_combo_breaker_buff",
		"modifier_winter_wyvern_winters_curse_aura",
		"modifier_winter_wyvern_winters_curse",
		"modifier_oracle_fates_edict",
		"modifier_item_lotus_orb_active",
		"modifier_antimage_counterspell",
	]
	// TODO
	private readonly AnyModifiers: string[] = [
		"modifier_dazzle_shallow_grave",
		"modifier_spirit_breaker_charge_of_darkness",
		"modifier_pugna_nether_ward_aura"
	]

	public get OrderCastDelay() {
		return ((GameData.Ping / 1000) + 200)
	}

	public Stop(unit: Unit) {
		if (ActionSleeper.IsSleeping) {
			unit.OrderStop()
			return false
		}
		ActionSleeper.Sleep(0.1)
		return true
	}

	public MoveToDirection(unit: Unit, target: Unit) {
		if (AbilitySleep.Sleeping(target))
			return false

		if (unit.TurnTime(unit?.Position) > 0.8) {
			if (ActionSleeper.IsSleeping)
				return false

			unit.AttackMove(unit?.Position)
			ActionSleeper.Sleep(unit.TurnTime(unit?.Position))
			return false
		}

		unit.MoveToDirection(target.Position)
		AbilitySleep.Sleep(this.OrderCastDelay, target)
		return true

	}

	public UseAbility(abil: Ability, HitAndRun: boolean = false, toogle: boolean = false, unit?: Unit | Vector3): boolean {
		let owner = abil.Owner

		if (owner === undefined || !abil.CanBeCasted() || owner.IsChanneling || owner.IsInAbilityPhase)
			return false

		if (unit instanceof Unit && !HitAndRun) {
			if (!unit?.IsAlive)
				return false

			if (owner.TurnTime(unit?.Position) > 0.2) {
				if (ActionSleeper.IsSleeping)
					return false

				owner.AttackMove(unit?.Position)
				ActionSleeper.Sleep(owner.TurnTime(unit?.Position))
				return false
			}
		}

		if (abil === undefined || AbilitySleep.Sleeping(abil))
			return false

		let castDelay = !abil.IsItem ? (((abil.CastPoint * 2) * 1000) + this.OrderCastDelay) : this.OrderCastDelay

		if (toogle) {
			abil.UseAbility(owner, true)
			AbilitySleep.Sleep(castDelay, abil)
			return true
		}

		if (unit !== undefined) {
			abil.UseAbility(unit)
			AbilitySleep.Sleep(castDelay, abil)
			return true
		}

		abil.UseAbility(owner)
		AbilitySleep.Sleep(castDelay, abil)
		return true
	}

	public AbilityForCancel(target: Unit): boolean {
		return !target.IsInvulnerable && !target.ModifiersBook.HasAnyBuffByNames(this.CancelModifiers)
	}

	public CancelMagicImmune(target: Unit): boolean {
		return !target.IsMagicImmune && !this.DuelAghanimsScepter(target)
	}

	public IsLinkensProtected(unit: Unit) {
		let itemSphere = unit.GetItemByClass(item_sphere)
		return itemSphere && itemSphere?.Cooldown <= 0 || unit.HasBuffByName("modifier_item_sphere_target")
	}

	public IsSpellShieldProtected(unit: Unit): boolean {
		let spellShield = unit.GetAbilityByClass(antimage_spell_shield)
		return spellShield && spellShield.Cooldown <= 0 || false
	}

	public IsBlockingAbilities(owner: Unit, target: Unit, arr_linken: Constructor<Ability>[], LinkenSelectror: Menu.ImageSelector, checkReflecting: boolean = false) {
		if (checkReflecting && target.HasBuffByName("modifier_item_lotus_orb_active")) {
			return true
		}

		if (this.IsLinkensProtected(target)) {
			this.UseLinkenBreaker(owner, target, arr_linken, LinkenSelectror)
			return true
		}

		if (this.IsSpellShieldProtected(target)) {
			return true
		}

		return false
	}

	public UseLinkenBreaker(owner: Unit, target: Unit, arr_linken: Constructor<Ability>[], LinkenSelectror: Menu.ImageSelector) {
		if (target === undefined || target.IsInvulnerable || target.IsMagicImmune)
			return
		if (arr_linken.some(item => this.LinkenBreaker(owner, item, target, LinkenSelectror)))
			return
	}

	private DuelAghanimsScepter(target: Unit): boolean {
		return target.HasBuffByName("modifier_legion_commander_duel")
			&& EntityManager.GetEntitiesByClass(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(x =>
				x.IsValid
				&& x.IsVisible
				&& x.IsAlive
				&& x.Name === "npc_dota_hero_legion_commander"
				&& x.HasScepter
			)
	}

	private IsValidLinkenBreaker(abil: Ability, target: Unit, Selectror: Menu.ImageSelector) {
		return abil !== undefined && abil.CanBeCasted()
			&& Selectror.IsEnabled(abil.Name)
			&& abil.CanHit(target)
	}

	private LinkenBreaker(owner: Unit, abil: Constructor<Ability>, target: Unit, LinkenSelectror: Menu.ImageSelector) {
		let ability = owner.GetAbilityByClass(abil) ?? owner.GetItemByClass(abil as Constructor<Item>)
		if (!this.IsValidLinkenBreaker(ability!, target, LinkenSelectror))
			return false
		if (this.UseAbility(ability!, false, false, target))
			return true
	}

}

EventsSDK.on("GameEnded", () => {
	SleepTick.ResetTimer()
	ActionSleeper.Reset()
	AbilitySleep.FullReset()
})
