import {
	ArrayExtensions, Creep, Entity,
	Hero, TrackingProjectile, Utils,
} from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { NearMouse, State } from "./Menu"
import { ComboDeleteVarsTemp } from "./Module/Combo"
import { AutoComboDeleteVars } from "./Module/AutoCombo"
import { AutoDisableDeleteVars } from "./Module/AutoDisable"
import { LinkenBreakerDeleteVars } from "./Module/LinkenBreaker"
import { AutoModeDeleteVars } from "./Module/SpamMode"
import { WithoutFailDestroy } from "./Module/WithoutFail"

export let Heroes: Hero[] = []
export let Creeps: Creep[] = []

export let MyHero: Hero
export let MouseTarget: Hero
export let ProjList: TrackingProjectile[] = []
export let MyNameHero: string = "npc_dota_hero_skywrath_mage"

export function InitMouse() {
	if (!Base.IsRestrictions(State))
		return false
	MouseTarget = ArrayExtensions.orderBy (
		Heroes.filter(x => x.IsEnemy() && x.Distance(Utils.CursorWorldVec) <= NearMouse.value && x.IsAlive),
		x => x.Distance(Utils.CursorWorldVec),
	)[0]
}

export function GameEnded() {
	MyHero = undefined
	MouseTarget = undefined
	Heroes = []
	Creeps = []
	ProjList = []
	WithoutFailDestroy()
	AutoModeDeleteVars()
	ComboDeleteVarsTemp()
	AutoComboDeleteVars()
	AutoDisableDeleteVars()
	LinkenBreakerDeleteVars()
}

export function GameStarted(hero: Hero) {
	if (MyHero === undefined && hero.Name === MyNameHero) {
		MyHero = hero
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
		if (Heroes !== undefined || Heroes.length > 0) {
			ArrayExtensions.arrayRemove(Heroes, x)
		}
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
	if (ProjList !== undefined || ProjList.length > 0) {
		ArrayExtensions.arrayRemove(ProjList, proj)
	}
}