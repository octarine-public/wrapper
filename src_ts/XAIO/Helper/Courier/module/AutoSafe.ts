import { Units } from "XAIO/bootstrap"
import { CourierHelper } from "../Helper"
import { MoveCourier } from "./MoveCourier"
import { XAIOAutoSafeState, XAIOAutoSafeValue } from "../Menu"
import { Courier, Ability, Unit, EventsSDK, ArrayExtensions, GameSleeper, Creep, Tower, Hero, GameState } from "wrapper/Imports"

let UnitAnimation: Unit[] = []
let Sleep: GameSleeper = new GameSleeper()

function AbilityTypeReady(courier: Courier): Nullable<Ability> {
	let IsCooldownReady = courier.GetAbilityByName("courier_shield")?.IsCooldownReady
	if (IsCooldownReady && !courier.HasBuffByName("modifier_courier_burst"))
		return courier.GetAbilityByName("courier_shield")
	else if (!IsCooldownReady && !courier.HasBuffByName("modifier_courier_shield"))
		return courier.GetAbilityByName("courier_burst")
}

function SafePosDeliver(courier: Courier) {
	Units.forEach(unit => {
		if (!(unit instanceof Creep || unit instanceof Hero || unit instanceof Tower))
			return

		if (!unit.IsEnemy() || !unit.IsAlive || !unit.IsVisible)
			return

		if (!Sleep.Sleeping(courier) && (CourierHelper.IsRangeCourier(unit, courier) || CourierHelper.IsRangeCourier(unit)))
			CourierHelper.DELIVER_DISABLE = true

		if (!CourierHelper.DELIVER_DISABLE)
			return

		if (courier.State !== CourierHelper.ATBASE)
			CourierHelper.DELIVER_DISABLE = false

		if (!CourierHelper.AllowMap.some(x => x.includes(GameState.MapName))) {

			if (courier.State !== CourierHelper.TOBASE)
				CourierHelper.CastCourAbility(0, courier)

			Sleep.Sleep(XAIOAutoSafeValue.value * 1000, courier)
			return
		}

		if (!CourierHelper.IsRangeCourier(unit, courier) || !CourierHelper.IsRangeCourier(unit)) {

			if (courier.State !== CourierHelper.TOBASE)
				MoveCourier(courier, true)

			Sleep.Sleep(XAIOAutoSafeValue.value * 1000, courier)
			return
		}
	})
}

export function AutoSafe(courier: Courier) {
	if (!XAIOAutoSafeState.value || CourierHelper.IsTurbo)
		return

	let ability = AbilityTypeReady(courier)

	if (ability === undefined || ability.Level === 0 || ability.Cooldown) {
		SafePosDeliver(courier)
		return
	}

	if (UnitAnimation.length <= 0)
		return

	let attack_courier = UnitAnimation.some(unit =>
		CourierHelper.WARNING_ABILITY.some(abil => abil !== undefined
			&& unit.GetAbilityByName(abil)
			&& unit.IsInRange(courier, unit.GetAbilityByName(abil)?.CastRange ?? 0)
			&& !unit.GetAbilityByName(abil)?.IsInAbilityPhase
		) || (
			unit.IsInRange(courier, (unit.AttackRange + unit.HullRadius))
			&& unit.AttackDamage(courier, true) > courier.HP
		)
	)

	if (!attack_courier && UnitAnimation.length !== 0 || !ability.IsCooldownReady)
		return

	if (ability.Name === "courier_burst") {
		CourierHelper.CastCourAbility(0, courier)
		ability.UseAbility()
		Sleep.Sleep(CourierHelper.CastDelay, courier)
		return
	}

	ability.UseAbility()
	Sleep.Sleep(CourierHelper.CastDelay, courier)
	return
}

EventsSDK.on("GameEnded", () => {
	Sleep.FullReset()
	UnitAnimation = []
})

EventsSDK.on("UnitAnimation", unit => {
	if (unit.IsEnemy())
		UnitAnimation.push(unit)
})

EventsSDK.on("UnitAnimationEnd", unit => {
	if (unit.IsEnemy())
		ArrayExtensions.arrayRemove(UnitAnimation, unit)
})