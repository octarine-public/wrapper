//@ts-nocheck
import { Game, Menu } from "wrapper/Imports"
import { Heroes, Owner } from "../Listeners"
class LinaHelper {
	public get DeadInSide(): boolean {
		return Heroes.length === 0
			|| Owner === undefined
			|| !Heroes.some(x => x.IsEnemy() && x.IsAlive)
			|| !Owner.IsAlive
	}
	public IsRestrictions(State: Menu.Toggle) {
		return State.value && !Game.IsPaused && Game.IsInGame && Owner !== undefined && Owner.IsAlive
	}
}
export let Base = new LinaHelper()