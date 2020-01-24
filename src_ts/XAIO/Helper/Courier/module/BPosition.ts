import { MoveCourier } from "./index"
import { Courier, Creep, Hero, Unit, Vector3, GameRules, DOTA_GameState, GameState } from "wrapper/Imports"
import { CourierHelper } from "../Helper"
import { XAIOBestPosState } from "../Menu"
import { Units } from "XAIO/bootstrap"

function CourierLogicBestPosition(unit: Unit, courier: Courier, Position: Vector3) {
	if (!unit.IsAlive)
		return false

	if (CourierHelper.IsRangeCourier(courier, Position))
		CourierHelper.DELIVER_DISABLE = CourierHelper.IsRangeCourier(unit, Position)

	if (CourierHelper.IsRangeCourier(unit, Position)) {
		if (courier.State === CourierState_t.COURIER_STATE_AT_BASE || courier.State === CourierState_t.COURIER_STATE_RETURNING_TO_BASE)
			return false

		MoveCourier(true, courier)
		return true

	} else if (!CourierHelper.IsRangeCourier(courier, Position, 50) && courier.StateHero === undefined) {

		if (courier.State === CourierState_t.COURIER_STATE_RETURNING_TO_BASE)
			return false

		MoveCourier(false, courier)
		return true
	}
}

function BestPosition(unit: Unit, courier: Courier) {

	if (unit.IsAlive && unit.IsVisible && CourierHelper.IsRangeCourier(unit)) {
		MoveCourier(true, courier)
		CourierHelper.DELIVER_DISABLE = true
		return true
	}

	return CourierLogicBestPosition(unit, courier, CourierHelper.Position())
}

export function BPosition(courier: Courier) {
	if (!XAIOBestPosState.value || /* CourierHelper.IsRestricted(courier) || */ !CourierHelper.AllowMap.some(x => x.includes(GameState.MapName)))
		return

	if (GameRules?.GameState === DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME
		&& Math.abs(Math.round(GameRules?.GameTime!)) === 85)
		MoveCourier(false, courier)

	if (Units.some(unit =>
		(unit instanceof Creep || unit instanceof Hero)
		&& unit.IsEnemy()
		&& BestPosition(unit, courier)))
		return
}