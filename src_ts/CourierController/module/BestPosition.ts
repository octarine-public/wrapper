import { Hero, Courier, Vector3, DOTA_GameMode, Game } from "wrapper/Imports"
import { StateBestPos } from "../Menu"
import { CourierBase } from "../Data/Helper"
import { Sleep, allyCourier, EnemyHero, OwnerIsValid } from "../bootstrap"

function CourierLogicBestPosition(enemy: Hero, StateCourier: Courier, Position: Vector3) {
	if (!enemy.IsEnemy() || enemy.IsDormant || !enemy.IsAlive)
		return false
	CourierBase.DELIVER_DISABLE = CourierBase.IsRangeCourier(enemy, Position)
	if (CourierBase.IsRangeCourier(enemy, Position)) {
		if (StateCourier.State !== CourierState_t.COURIER_STATE_AT_BASE && StateCourier.State !== CourierState_t.COURIER_STATE_RETURNING_TO_BASE) {
			MoveCourier(true)
			return false
		}
	}
	else if (!CourierBase.IsRangeCourier(allyCourier, Position, 50) && StateCourier.StateHero === undefined) {
		if (StateCourier.State !== CourierState_t.COURIER_STATE_RETURNING_TO_BASE) {
			MoveCourier()
			return true
		}
	}
}

export function CourierBestPosition() {
	if (Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO || !StateBestPos.value)
		return false
	return EnemyHero.some(enemy => {
		switch (allyCourier.State) {
			case CourierState_t.COURIER_STATE_IDLE:
			case CourierState_t.COURIER_STATE_AT_BASE:
			case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
				if (!CourierLogicBestPosition(enemy, allyCourier, CourierBase.Position()))
					return false
			case CourierState_t.COURIER_STATE_MOVING:
			case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
				if (enemy.IsEnemy() && enemy.IsAlive && !enemy.IsDormant && CourierBase.IsRangeCourier(enemy)) {
					MoveCourier(true)
					CourierBase.DELIVER_DISABLE = true
					return true
				}
				CourierBase.DELIVER_DISABLE = false
				return false
		}
	})
}

export function MoveCourier(Safe: boolean = false, line?: number) {
	if (Game.IsPaused || !OwnerIsValid() || !CourierBase.IsValidCourier(allyCourier))
		return
	if (!Safe) {
		allyCourier.MoveTo(CourierBase.Position(false, line))
		Sleep.Sleep(CourierBase.CastDelay)
		return
	}
	if (!CourierBase.IsRangeCourier(allyCourier, CourierBase.Position(Safe, line), 150)) {
		allyCourier.MoveTo(CourierBase.Position(Safe, line))
		Sleep.Sleep(CourierBase.CastDelay)
		return
	}
}