import { Hero, ArrayExtensions, Entity, Creep, Utils, TrackingProjectile } from "wrapper/Imports"
import { ComboGameEnded } from "./Module/Combo"
import { DrawDeleteTempAllVars } from "./Renderer"
import { State, NearMouse } from "./Menu"
import { Base } from "./Extends/Helper"

export let Heroes: Hero[] = []
export let Owner: Hero
export let MouseTarget: Hero
export let CreepsNeutrals: Creep[] = []
export let MyNameHero: string = "npc_dota_hero_lina"

export function InitMouse() {
	if (!Base.IsRestrictions(State)) {
		return
	}
	MouseTarget = ArrayExtensions.orderBy(
		Heroes.filter(x => x.IsEnemy() && x.Distance(Utils.CursorWorldVec) <= NearMouse.value && x.IsAlive),
		x => x.Distance(Utils.CursorWorldVec),
	)[0]
}
export function GameStarted(hero: Hero) {
	if (Owner === undefined && hero.Name === MyNameHero) {
		Owner = hero
	}
}
export function GameEnded() {
	Owner = undefined
	MouseTarget = undefined
	Heroes = []
	CreepsNeutrals = []
	ComboGameEnded()
	DrawDeleteTempAllVars()
	MyNameHero = "npc_dota_hero_lina"
}

export function EntityCreated(x: Entity) {
	if (x instanceof Hero && !x.IsIllusion) {
		Heroes.push(x)
	}
	if (x instanceof Creep && x.IsNeutral) {
		CreepsNeutrals.push(x)
	}
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Hero) {
		ArrayExtensions.arrayRemove(Heroes, x)
	}
	if (x instanceof Creep) {
		ArrayExtensions.arrayRemove(CreepsNeutrals, x)
	}
}