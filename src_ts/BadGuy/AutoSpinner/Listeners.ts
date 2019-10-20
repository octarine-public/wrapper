import { Entity, Unit, Building, GameSleeper, ArrayExtensions, Game, Vector3 } from "wrapper/Imports";
import { State, Swhicher, SpinnerKey, ModeSpinner } from "./Menu";

export let Units: Unit[] = [],
	EnemyBase: Building[] = [],
	Sleep: GameSleeper = new GameSleeper()

function MoveUnit(x: Unit) {
	switch (ModeSpinner.selected_id) {
		case 0: x.MoveTo(x.InFrontFromAngle(300, 1)); break;
		case 1: x.MoveTo(x.InFrontFromAngle(250, 50)); break;
	}
}

export function Tick() {
	if (!State.value || !SpinnerKey.is_pressed) {
		return false
	}
	// loop-optimizer: FORWARD
	Units.filter(x => x !== undefined && x.IsAlive && x.IsControllable && x.IsVisible && !x.IsStunned && !x.IsHexed)
	.some(x => {
		switch (Swhicher.selected_id) {
			case 0:
				if (x.IsHero) {
					MoveUnit(x)
				}
			break;
			case 1: MoveUnit(x); break;
		}
	})
}

export function EntityCreated(x: Entity) {
	if (x instanceof Unit && x.IsControllable) {
		Units.push(x)
	}
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Unit && x.IsControllable) {
		if (Units !== undefined || Units.length > 0) {
			ArrayExtensions.arrayRemove(Units, x)
		}
	}
}

export function GameEnded() {
	Sleep.FullReset()
	Units = []
}