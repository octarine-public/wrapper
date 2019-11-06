import { ArrayExtensions, Creep, Entity, Hero, TrackingProjectile, Utils } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { NearMouse, State } from "./Menu"
import { GameEndedCombo } from "./Module/Combo"
import { DeleteLinkenBreakAllVars } from "./Module/LinkenBreaker"
import { DrawDeleteTempAllVars } from "./Renderer"

export let Heroes: Hero[] = []
export let Creeps: Creep[] = []
export let Owner: Hero
export let MouseTarget: Hero

export let ProjList: TrackingProjectile[] = []
export let MyNameHero: string = "npc_dota_hero_legion_commander"

export function InitMouse() {
	if (!Base.IsRestrictions(State))
		return false
	MouseTarget = ArrayExtensions.orderBy (
		Heroes.filter(x => x.IsEnemy() && x.Distance(Utils.CursorWorldVec) <= NearMouse.value && x.IsAlive),
		x => x.Distance(Utils.CursorWorldVec),
	)[0]
}

export function GameEnded() {
	Owner = undefined
	MouseTarget = undefined
	Heroes = []
	Creeps = []
	ProjList = []
	GameEndedCombo()
	DrawDeleteTempAllVars()
	DeleteLinkenBreakAllVars()
}

export function GameStarted(hero: Hero) {
	if (Owner === undefined && hero.Name === MyNameHero) {
		Owner = hero
	}
}

export function EntityCreated(x: Entity) {
	if (x instanceof Hero && !x.IsIllusion) {
		Heroes.push(x)
	}
	if (x instanceof Creep) {
		Creeps.push(x)
	}
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Hero) {
		ArrayExtensions.arrayRemove(Heroes, x)
	}
}

export function TrackingProjectileCreated(proj: TrackingProjectile) {
	if (!Base.IsRestrictions(State)) {
		return false
	}
	let Entity = proj.Source as Entity
	if (proj instanceof TrackingProjectile
		&& Entity instanceof Hero
		&& !Entity.IsEnemy() && Entity.Name === MyNameHero) {
		ProjList.push(proj)
	}
}

export function LinearProjectileDestroyed(proj: TrackingProjectile) {
	if (proj instanceof TrackingProjectile) {
		ArrayExtensions.arrayRemove(ProjList, proj)
	}
}