import { Hero, ArrayExtensions, Utils, Entity, Creep } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { State, NearMouse } from "./Menu"
import { ComboGameEnded } from "./Module/Combo"
import { DrawDeleteTempAllVars } from "./Renderer"

export let Heroes: Hero[] = []
export let Owner: Hero
export let MouseTarget: Hero
export let CreepsNeutrals: Creep[] = []
export let MyNameHero: string = "npc_dota_hero_kunkka"

export function InitMouse() {
	if (!Base.IsRestrictions(State))
		return false
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
	MyNameHero = "npc_dota_hero_kunkka"
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
		if (Heroes !== undefined || Heroes.length > 0) {
			ArrayExtensions.arrayRemove(Heroes, x)
		}
	}
	if (x instanceof Creep) {
		if (CreepsNeutrals !== undefined || CreepsNeutrals.length > 0) {
			ArrayExtensions.arrayRemove(CreepsNeutrals, x)
		}
	}
}