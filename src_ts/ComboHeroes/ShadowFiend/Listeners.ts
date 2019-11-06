import { ArrayExtensions, Creep, Entity, Hero, Utils } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { NearMouse, State } from "./Menu"
import { ComboGameEnded } from "./Module/Combo"
import { DrawDeleteTempAllVars } from "./Renderer"
export let Heroes: Hero[] = []
export let Owner: Hero
export let MouseTarget: Hero
export let MyNameHero: string = "npc_dota_hero_nevermore"

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
	ComboGameEnded()
	DrawDeleteTempAllVars()
	MyNameHero = "npc_dota_hero_nevermore"
}

export function EntityCreated(x: Entity) {
	if (x instanceof Hero && !x.IsIllusion) {
		Heroes.push(x)
	}
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Hero) {
		ArrayExtensions.arrayRemove(Heroes, x)
	}
}