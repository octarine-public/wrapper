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

import { Sleeper, XAIOGame } from "../bootstrap"

let GameData = new XAIOGame()

let SleepTick = new TickSleeper() 		// tick ms
let ActionSleeper = new Sleeper() 		// sleep sec
let TreadSleeper = new Sleeper() 		// sleep sec
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

	private readonly CounterBlockSpells: string[] = [
		"modifier_item_lotus_orb_active",
		"modifier_antimage_counterspell",
	]

	public DefaultDelay = 50
	public AbilityDelay = 100
	public AttackMoveDelay = this.DefaultDelay + this.AbilityDelay

	public get TickDelay(): number {
		return 30
	}

	public get InputLag() {
		return (GameData.Ping / 1000) + this.TickDelay
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
		AbilitySleep.Sleep(this.AttackMoveDelay + this.InputLag, target)
		return true

	}

	public UseAbility(
		ability: Ability,
		OrbWallkerState: boolean = false,
		target?: Unit | Vector3,
		checkToggled: boolean = false,
		vectorTargetPosition: boolean = false // TODO ...args settings
	): boolean {
		let Owner = ability.Owner

		if (Owner === undefined || !ability.CanBeCasted() || Owner.IsChanneling || Owner.IsInAbilityPhase)
			return false

		if (AbilitySleep.Sleeping(ability))
			return false

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)) {

			if (target instanceof Unit)
				target = target.Position

			if (!this.ShouldCast(Owner, target as Vector3, OrbWallkerState))
				return false
			Owner.CastPosition(ability, target as Vector3)
			AbilitySleep.Sleep(this.CastTime(ability), ability)
			return true
		}

		if (checkToggled && ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) && !ability.IsToggled) {
			Owner.CastToggle(ability)
			AbilitySleep.Sleep(this.AbilityDelay + this.InputLag, ability)
			return true
		}

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
			Owner.CastNoTarget(ability)
			AbilitySleep.Sleep(this.AbilityDelay + this.InputLag, ability)
			return true
		}

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)) {

			if (!(target instanceof Unit) || !target.IsAlive || !this.ShouldCast(Owner, target, OrbWallkerState))
				return false

			if (vectorTargetPosition) {
				let Speed = target.IdealSpeed < 400 ? 500 : 700
				Owner.CastVectorTargetPosition(ability,
					target.Position.Extend(target.InFront(1000), target.IsMoving ? Speed : 300),
					target.Position.Extend(target.InFront(-1000), 1000 + (target.IsMoving ? Speed : 300)))

				AbilitySleep.Sleep(this.CastTime(ability), ability)
				return true
			}

			if (target.ModifiersBook.HasAnyBuffByNames(this.CounterBlockSpells))
				return false

			Owner.CastTarget(ability, target)
			AbilitySleep.Sleep(this.CastTime(ability), ability)
			return true
		}

		return false
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

	public IsBlockingAbilities(owner: Unit, target: Unit, arr_linken: Constructor<Ability>[], OrbWalkerState: boolean = false, LinkenSelectror: Menu.ImageSelector, checkReflecting: boolean = false) {

		if (checkReflecting && target.HasBuffByName("modifier_item_lotus_orb_active"))
			return true

		if (this.IsLinkensProtected(target)) {
			this.UseLinkenBreaker(owner, target, arr_linken, OrbWalkerState, LinkenSelectror)
			return true
		}

		return this.IsSpellShieldProtected(target)
	}

	public UseLinkenBreaker(owner: Unit, target: Unit, arr_linken: Constructor<Ability>[], OrbWalkerState: boolean = false, LinkenSelectror: Menu.ImageSelector) {
		if (target === undefined || target.IsInvulnerable || target.IsMagicImmune)
			return
		if (arr_linken.some(item => this.LinkenBreaker(owner, item, target, OrbWalkerState, LinkenSelectror)))
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

	private LinkenBreaker(owner: Unit, abil: Constructor<Ability>, target: Unit, OrbWallkerState: boolean = false, LinkenSelectror: Menu.ImageSelector) {
		let ability = owner.GetAbilityByClass(abil) ?? owner.GetItemByClass(abil as Constructor<Item>)
		if (!this.IsValidLinkenBreaker(ability!, target, LinkenSelectror))
			return false
		if (this.UseAbility(ability!, OrbWallkerState, target))
			return true
	}

	private ShouldCast(owner: Unit, target: Unit | Vector3, OrbWallker: boolean = false): boolean {

		if (target instanceof Unit)
			target = target.Position

		if (owner.TurnTime(target) > 0.02) {
			if (TreadSleeper.IsSleeping || OrbWallker)
				return false

			owner.MoveTo(target) // turn to target
			TreadSleeper.Sleep(owner.TurnTime(target))
			return false
		}
		return true
	}

	private CastTime(ability: Ability): number {
		return !ability.IsItem ? ability.GetCastDelay(ability.Position) + this.DefaultDelay : this.DefaultDelay + this.InputLag
	}

}

EventsSDK.on("GameEnded", () => {
	SleepTick.ResetTimer()
	ActionSleeper.Reset()
	AbilitySleep.FullReset()
})
