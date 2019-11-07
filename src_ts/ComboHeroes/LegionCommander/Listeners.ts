import { ArrayExtensions, Creep, Entity, Hero, TrackingProjectile, Utils, Unit } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { NearMouse, State } from "./Menu"
import { GameEndedCombo } from "./Module/Combo"
import { DeleteLinkenBreakAllVars } from "./Module/LinkenBreaker"
import { DrawDeleteTempAllVars } from "./Renderer"

import InitItems from "./Extends/Items"
import InitAbilities from "./Extends/Abilities"
import InitDrawBase from "../Base/DrawDotTarget"

export let Heroes: Hero[] = []
export let Creeps: Creep[] = []
export let Owner: Hero
export let MouseTarget: Hero

export const initItemsMap = new Map<Unit, InitItems>()
export const initAbilityMap = new Map<Unit, InitAbilities>()
export const initDrawBaseMap = new Map<Unit, InitDrawBase>()

export let ProjList: TrackingProjectile[] = []
export const MyNameHero: string = "npc_dota_hero_legion_commander"

export function InitMouse() {
	if (!Base.IsRestrictions(State)) {
		return false
	}
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
	// new InitDrawBase().ResetEnemyParticle()
	GameEndedCombo()
	initItemsMap.clear()
	initAbilityMap.clear()
	initDrawBaseMap.clear()
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
	let entity = proj.Source as Entity
	if (proj instanceof TrackingProjectile
		&& entity instanceof Hero
		&& !entity.IsEnemy() && entity.Name === MyNameHero) {
		ProjList.push(proj)
	}
}

export function LinearProjectileDestroyed(proj: TrackingProjectile) {
	if (proj instanceof TrackingProjectile) {
		ArrayExtensions.arrayRemove(ProjList, proj)
	}
}

export function Tick() {
	let initItems = initItemsMap.get(Owner)
	if (initItems === undefined) {
		initItems = new InitItems(Owner)
		initItemsMap.set(Owner, initItems)
	}
	let initAbility = initAbilityMap.get(Owner)
	if (initAbility === undefined) {
		initAbility = new InitAbilities(Owner)
		initAbilityMap.set(Owner, initAbility)
	}
	let initDrawBase = initDrawBaseMap.get(Owner)
	if (initDrawBase === undefined) {
		initDrawBase = new InitDrawBase(Owner)
		initDrawBaseMap.set(Owner, initDrawBase)
	}
}