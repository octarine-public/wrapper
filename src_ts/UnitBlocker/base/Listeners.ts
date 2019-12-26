import { ArrayExtensions, Creep, EventsSDK, Hero, Tower, Unit } from "wrapper/Imports"
import { baseCheckUnit } from "../modules/Controllables"

// --- Variables

export let allHeroes: Hero[] = []
export let allNPCs: Unit[] = []
export let allCreeps: Creep[] = []
export let allTowers: Tower[] = []

// --- Methods
EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Creep && ent.IsLaneCreep)
		allCreeps.push(ent)
	else if (ent instanceof Tower)
		allTowers.push(ent)
	else if (ent instanceof Unit && baseCheckUnit(ent)) {
		if (ent instanceof Hero)
			allHeroes.push(ent)
		allNPCs.push(ent)
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Unit) {
		if (ent instanceof Hero)
			ArrayExtensions.arrayRemove(allHeroes, ent)
		ArrayExtensions.arrayRemove(allNPCs, ent)
	} else if (ent instanceof Tower)
		ArrayExtensions.arrayRemove(allTowers, ent)
	else if (ent instanceof Creep)
		ArrayExtensions.arrayRemove(allCreeps, ent)
})

export function AllClearArray() {
	allNPCs = []
	allCreeps = []
	allTowers = []
	allHeroes = []
}
