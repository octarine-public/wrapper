//@ts-nocheck
import { Game, Menu, EntityManager, Hero } from "wrapper/Imports"
import { Owner } from "../Listeners"

class VoidSpiritHelper {
	public get DeadInSide(): boolean {
		let Heroes = EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
		return Heroes.length === 0
			|| Owner === undefined
			|| !Heroes.some(x => x.IsAlive)
			|| !Owner.IsAlive
	}
	public IsRestrictions(State: Menu.Toggle) {
		return State.value && !Game.IsPaused && Game.IsInGame && Owner !== undefined && Owner.IsAlive
	}
}
export let Base = new VoidSpiritHelper()