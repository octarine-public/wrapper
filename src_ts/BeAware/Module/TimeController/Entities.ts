import { Hero, Unit, Entity, Creep, ArrayExtensions } from "wrapper/Imports"
export let Units: Unit[] = []
export let Owner: Hero
export let RadarDetect: Entity[] = []
export let OtherRadius = new Map<Entity, number>()
export function GameStarted(x: Hero) {
	if(Owner === undefined) {
		Owner = x
	}
}
export function IsShrine(x: Unit) {
	return x.Name !== "dota_fountain" && !x.IsShop && x.IsAlive && x.IsBuilding && !x.IsTower && !x.IsFort && !x.IsShrine && !x.IsBarrack
} 
export function EntityCreated(x: Entity) {
	if (x instanceof Entity) {
		if (x !== undefined && x.Name !== undefined) {
			if (x.Name.includes("npc_dota_thinker")) {
				RadarDetect.push(x)
			}
		}
	}
	if (x instanceof Unit && !x.IsHero) {
		Units.push(x)
	}
}
export function EntityDestroyed(x: Entity) {
	if(x instanceof Entity) {
		if (RadarDetect !== undefined || RadarDetect.length > 0) {
			ArrayExtensions.arrayRemove(RadarDetect, x)
		}
	}
	if (x instanceof Entity && x instanceof Creep && x.IsLaneCreep && !x.IsHero) {
		if (Units !== undefined || Units.length > 0) {
			ArrayExtensions.arrayRemove(Units, x)
		}
	}
}
export function GameEnded() {
	Units = []
	RadarDetect = []
	OtherRadius.clear()
	Owner = undefined
}