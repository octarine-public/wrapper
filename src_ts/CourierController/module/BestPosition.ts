import { Hero, Courier, Vector3, DOTA_GameMode, Game } from "wrapper/Imports"
import { StateBestPos } from "../Menu"
import { CourierBase } from "../Data/Helper"
import { Sleep, allyCourier, EnemyHero } from "../bootstrap"

function CourierLogicBestPosition(enemy: Hero, StateCourier: Courier, Position: Vector3) {
	if (!enemy.IsEnemy() || !enemy.IsVisible) {
		return false
	}
	if (enemy.IsInRange(Position, (enemy.AttackRange + 450))) {
		if (StateCourier.State !== CourierState_t.COURIER_STATE_AT_BASE
			&& StateCourier.State !== CourierState_t.COURIER_STATE_RETURNING_TO_BASE
		) {
			MoveCourier(true)
			CourierBase.DELIVER_DISABLE = true
			return false
		}
	} else if (!allyCourier.IsInRange(Position, 50)
		&& StateCourier.StateHero === undefined // if courier not busy (none control)
	) {
		if (StateCourier.State !== CourierState_t.COURIER_STATE_RETURNING_TO_BASE
		) {
			MoveCourier()
			CourierBase.DELIVER_DISABLE = false
			return true
		}
	}
}

export function CourierBestPosition() {
	if (Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO || !StateBestPos.value) {
		return false
	}
	return EnemyHero.some(enemy => {
		switch (allyCourier.State) {
			case CourierState_t.COURIER_STATE_IDLE:
			case CourierState_t.COURIER_STATE_AT_BASE:
			case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
				if (!CourierLogicBestPosition(enemy, allyCourier, CourierBase.Position())) {
					return false
				}
			case CourierState_t.COURIER_STATE_MOVING:
			case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
				if (enemy.IsEnemy() && enemy.IsVisible && enemy.IsInRange(CourierBase.Position(), (enemy.AttackRange + 450))) {
					MoveCourier(true)
					CourierBase.DELIVER_DISABLE = true
					return true
				}
				CourierBase.DELIVER_DISABLE = false
				return false
		}
	})
}

export function MoveCourier(BestOrSafe: boolean = false) {
	if (!BestOrSafe) {
		allyCourier.MoveTo(CourierBase.Position())
		Sleep.Sleep(CourierBase.CastDelay)
		return
	}
	if (!allyCourier.IsInRange(CourierBase.Position(BestOrSafe), 150)) {
		allyCourier.MoveTo(CourierBase.Position(BestOrSafe))
		Sleep.Sleep(CourierBase.CastDelay)
		return
	}
}