import { Unit, Building, GameSleeper } from "wrapper/Imports";
import { State, Swhicher, DrawState } from "./Menu";
import { Renderer } from "./Renderer";
import { Units } from "../Base/ListenersBase";

export let EnemyBase: Building[] = [],
	Sleep: GameSleeper = new GameSleeper()

function MoveUnit(x: Unit, to: Building) {
	x.MoveTo(to.NetworkPosition)
	Sleep.Sleep(250, "FeedTime")
}

export function Tick() {
	if (!State.value || Sleep.Sleeping("FeedTime")) {
		return false
	}
	let fontain = EnemyBase.find(x => x.IsEnemy())
	// loop-optimizer: FORWARD
	Units.filter(x => x !== undefined && x.IsAlive && x.IsControllable)
	.some(x => {
		if(!x.IsVisible) {
			return false
		}
		switch (Swhicher.selected_id) {
			case 0: 
				if (x.IsHero) {
					MoveUnit(x, fontain)
				}
			break;
			case 1:
				MoveUnit(x, fontain)
			break;
		}
	})
}

export function Draw() {
	if (State.value && DrawState.value) {
		Renderer()
	}
}

export function GameEnded() {
	Sleep.FullReset()
}