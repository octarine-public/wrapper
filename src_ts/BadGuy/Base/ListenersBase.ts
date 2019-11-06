import { ArrayExtensions, Building, Entity, Unit } from "wrapper/Imports";

export let AllUnits: Unit[] = []
export let EnemyBase: Building[] = []

export function EntityCreated(x: Entity) {
	if (x instanceof Unit)
		AllUnits.push(x)
	if (x instanceof Building && x.Name === "dota_fountain")
		EnemyBase.push(x)
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Unit)
		ArrayExtensions.arrayRemove(AllUnits, x)
}

export function GameEnded() {
	AllUnits = []
	EnemyBase = []
}