import { Unit, ArrayExtensions, Entity } from "wrapper/Imports";

export let Units: Unit[]

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
	Units = []
}