import { Hero, Unit, Entity, Creep, ArrayExtensions } from "wrapper/Imports"
export let Units: Unit[] = []
export let Owner: Hero
export function GameStarted(x: Hero) {
	if(Owner === undefined) {
		Owner = x
	}
}
export function IsShrine(x: Unit) {
	return x.Name !== "dota_fountain" && !x.IsShop && x.IsAlive && x.IsBuilding && !x.IsTower && !x.IsFort && !x.IsShrine && !x.IsBarrack
} 
export function EntityCreated(x: Entity) {
	if (x instanceof Unit && !x.IsHero) {
		Units.push(x)
	}
}
export function EntityDestroyed(x: Entity) {
	if (x instanceof Entity && x instanceof Creep && x.IsLaneCreep && !x.IsHero) {
		if (Units !== undefined || Units.length > 0) {
			ArrayExtensions.arrayRemove(Units, x)
		}
	}
}
export function GameEnded() {
	Units = []
	Owner = undefined
}