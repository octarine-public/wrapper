//@ts-nocheck
import { Game, Menu, Hero } from "wrapper/Imports"
import { Owner } from "../Listeners"
class LinaHelper {
	public get DeadInSide(): boolean {
		return Owner === undefined
			|| !EntityManager.GetEntitiesByClass(Hero).some(x => !x.IsIllusion && x.IsEnemy() && x.IsAlive)
			|| !Owner.IsAlive
	}
	public IsRestrictions(State: Menu.Toggle) {
		return State.value && !Game.IsPaused && Game.IsInGame && Owner !== undefined && Owner.IsAlive
	}
}
export let Base = new LinaHelper()
