import { Building, GameSleeper, Unit } from "wrapper/Imports";
import { AllUnits, EnemyBase } from "../Base/ListenersBase";
import { DrawState, State, Swhicher } from "./Menu";
import { Renderer } from "./Renderer";

export let Sleep: GameSleeper = new GameSleeper()

function MoveUnit(x: Unit, to: Building) {
	x.MoveTo(to.NetworkPosition)
	Sleep.Sleep(250, "FeedTime")
}

export function Tick() {
	if (!State.value || Sleep.Sleeping("FeedTime"))
		return

	let fontain = EnemyBase.find(x => x.IsEnemy())
	// loop-optimizer: FORWARD
	AllUnits
		.filter(x => x.IsAlive && x.IsControllable)
		.some(x => {
			if (!x.IsVisible)
				return false
			switch (Swhicher.selected_id) {
				case 0:
					if (x.IsHero) {
						MoveUnit(x, fontain)
						return true
					}
					break
				case 1:
					MoveUnit(x, fontain)
					break
			}
		})
}

export function Draw() {
	if (State.value && DrawState.value)
		Renderer()
}

export function GameEnded() {
	Sleep.FullReset()
}