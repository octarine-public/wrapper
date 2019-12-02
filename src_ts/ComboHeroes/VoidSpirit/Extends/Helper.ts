import { Game, Menu } from "wrapper/Imports"
import { Owner, Heroes } from "../Listeners"

class VoidSpiritHelper {
	public IsRestrictions(State: Menu.Toggle) {
		return State.value && !Game.IsPaused && Game.IsInGame && Owner !== undefined && Owner.IsAlive
	}
	public get DeadInSide(): boolean {
		return Heroes.length === 0
			|| Owner === undefined
			|| !Heroes.some(x => x.IsEnemy() && x.IsAlive)
			|| !Owner.IsAlive
	}
}
export let Base = new VoidSpiritHelper()