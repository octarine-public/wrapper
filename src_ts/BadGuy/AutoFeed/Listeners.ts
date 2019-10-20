import { Entity, Unit, Building, GameSleeper, ArrayExtensions } from "wrapper/Imports";
import { State, Swhicher, DrawState } from "./Menu";
import { Renderer } from "./Renderer";

export let Units: Unit[] = [],
	EnemyBase: Building[] = [],
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

export function EntityCreated(x: Entity) {
	if (x instanceof Unit && x.IsControllable) {
		Units.push(x)
	}
	if (x instanceof Building && x.Name === "dota_fountain") {
		EnemyBase.push(x)
	}
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Unit && x.IsControllable) {
		if (Units !== undefined || Units.length > 0) {
			ArrayExtensions.arrayRemove(Units, x)
		}
	}
}