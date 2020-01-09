import { Ability, Unit, TickSleeper, GameSleeper, Game, Vector3, Hero } from "wrapper/Imports"
import { XAIOInput, XAIOCollisionTypes, XAIOSkillshotType, XAIOPrediction, XAIOHitChance, Sleeper } from "./bootstrap"

let SleepTick = new TickSleeper(),
	ActionSleeper = new Sleeper(),
	AbilitySleep = new GameSleeper()

export default class AbilitiesHelper {

	private CancelModifiers = [
		"modifier_abaddon_borrowed_time",
		"modifier_item_combo_breaker_buff",
		"modifier_winter_wyvern_winters_curse_aura",
		"modifier_winter_wyvern_winters_curse",
		"modifier_oracle_fates_edict"
	]

	public get OrderCastDelay() {
		return (((Game.Ping / 2) / 1000) + 230)
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

		if (owner === undefined || owner.IsChanneling || owner.IsInAbilityPhase)
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

	public UseHook(abil: Ability, target: Unit) {
		let owner = abil.Owner
		if (owner === undefined)
			return false

		let InputDataHook = new XAIOInput(
			target,
			owner,
			abil.CastRange,
			abil.CastPoint,
			target.HullRadius,
			abil.AOERadius,
			XAIOCollisionTypes.AllUnits,
			0,
			true,
			XAIOSkillshotType.Line,
			abil.Speed, abil ? true : false
		)

		let xAIOPrediction = new XAIOPrediction(),
			prediction = xAIOPrediction.GetPrediction(InputDataHook)

		if (prediction.HitChance <= XAIOHitChance.Impossible)
			return false

		return !this.UseAbility(abil, true, false, prediction.CastPosition)
	}

	public UseBlinkLineCombo(blink: Ability, target: Unit) {

		let Owner = blink.Owner
		if (Owner === undefined)
			return false

		let InputDataBlink = new XAIOInput(
			target,
			Owner,
			blink.CastRange,
			0, 0, 0,
			XAIOCollisionTypes.None,
			blink.CastRange,
			true,
			XAIOSkillshotType.Line, 0, true
		)

		let xAIOPrediction = new XAIOPrediction(),
			predictionOutput = xAIOPrediction.GetPrediction(InputDataBlink)

		if (predictionOutput.HitChance <= XAIOHitChance.Impossible)
			return false

		return !this.UseAbility(blink, true, false, predictionOutput.BlinkLinePosition)
	}

	public AbilityForCancel(target: Unit): boolean {
		return !target.IsInvulnerable && !target.ModifiersBook.HasAnyBuffByNames(this.CancelModifiers)
	}

	public CancelMagicImmune(target: Unit): boolean {
		return !target.IsMagicImmune && !this.DuelAghanimsScepter(target)
	}

	public IsLinkensProtected(unit: Unit) {
		var linkens = unit.GetItemByName("item_sphere") ?? false
		return linkens && linkens?.Cooldown <= 0 || unit.HasBuffByName("modifier_item_sphere_target")
	}

	public IsSpellShieldProtected(unit: Unit): boolean {
		var spellShield = unit.GetAbilityByName("antimage_spell_shield") ?? false
		return spellShield && spellShield?.Cooldown <= 0
	}

	public IsBlockingAbilities(unit: Unit, checkReflecting: boolean = false) {
		if (checkReflecting && unit.HasBuffByName("modifier_item_lotus_orb_active")) {
			return true
		}

		if (this.IsLinkensProtected(unit)) {
			return true
		}

		if (this.IsSpellShieldProtected(unit)) {
			return true
		}

		return false
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

}

EventsSDK.on("GameEnded", () => {
	SleepTick.ResetTimer()
	ActionSleeper.Reset()
	AbilitySleep.FullReset()
})
