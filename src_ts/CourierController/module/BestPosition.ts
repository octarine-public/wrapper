import { Courier, Vector3, DOTA_GameMode, Game, Unit, Creep, Hero } from "wrapper/Imports"
import { StateBestPos } from "Menu"
import { CourierBase } from "Data/Helper"
import { EnemyUnits } from "Core/Listeners"
import { Sleep, OwnerIsValid } from "bootstrap"

function CourierLogicBestPosition(unit: Unit, courier: Courier, Position: Vector3) {
	if (!unit.IsAlive || unit.IsDormant)
		return false
	CourierBase.DELIVER_DISABLE = CourierBase.IsRangeCourier(unit, Position)
	if (CourierBase.IsRangeCourier(unit, Position)) {
		if (courier.State !== CourierState_t.COURIER_STATE_AT_BASE && courier.State !== CourierState_t.COURIER_STATE_RETURNING_TO_BASE) {
			MoveCourier(true, courier)
			return false
		}
	}
	else if (!CourierBase.IsRangeCourier(courier, Position, 50) && courier.StateHero === undefined) {
		if (courier.State !== CourierState_t.COURIER_STATE_RETURNING_TO_BASE) {
			MoveCourier(false, courier)
			return true
		}
	}
}

export function CourierBestPosition(courier: Courier) {
	if (Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO || !StateBestPos.value)
		return false
	return EnemyUnits.some(unit => {
		if (!(unit instanceof Creep) && !(unit instanceof Hero))
			return false
		switch (courier.State) {
			case CourierState_t.COURIER_STATE_IDLE:
			case CourierState_t.COURIER_STATE_AT_BASE:
			case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
				if (!CourierLogicBestPosition(unit, courier, CourierBase.Position()))
					return false
			case CourierState_t.COURIER_STATE_MOVING:
			case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
				if (unit.IsAlive && !unit.IsDormant && CourierBase.IsRangeCourier(unit)) {
					MoveCourier(true, courier)
					CourierBase.DELIVER_DISABLE = true
					return true
				}
				CourierBase.DELIVER_DISABLE = false
				return false
		}
	})
}

export function MoveCourier(Safe: boolean = false, courier: Courier, line?: number) {
	if (Game.IsPaused || !OwnerIsValid() || !CourierBase.IsValidCourier(courier))
		return
	if (!Safe) {
		courier.MoveTo(CourierBase.Position(false, line))
		Sleep.Sleep(CourierBase.CastDelay)
		return
	}
	if (!CourierBase.IsRangeCourier(courier, CourierBase.Position(Safe, line), 150)) {
		courier.MoveTo(CourierBase.Position(Safe, line))
		Sleep.Sleep(CourierBase.CastDelay)
		return
	}
}