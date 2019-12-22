import { ArrayExtensions, Entity, Hero, Utils, Unit } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { NearMouse, State } from "./Menu"
import { FindCycloneGameEnded } from "./Module/AutoArray"
import { AutoStealGameEnded } from "./Module/AutoSteal"

import ItemsX from "./Extends/Items"
import InitDraw from "./Extends/Draw"
import AbilityX from "./Extends/Abilities"
import HitAndRun from "./Extends/HitAndRun"
import { ComboEneded } from "./Module/Combo"

export let Heroes: Hero[] = []
export let Owner: Hero
export let MouseTarget: Hero
export let MyNameHero = "npc_dota_hero_lina"

export const initItemsMap = new Map<Unit, ItemsX>()
export const initAbilityMap = new Map<Unit, AbilityX>()
export const initDrawMap = new Map<Unit, InitDraw>()
export const initHitAndRunMap = new Map<Unit, HitAndRun>()

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
function MapClear() {
	initItemsMap.clear()
	initAbilityMap.clear()
	initDrawMap.clear()
	new InitDraw().GameEndedParticleRemove()
}

export function GameEnded() {
	MapClear()
	Heroes = []
	Owner = undefined
	ComboEneded()
	AutoStealGameEnded()
	FindCycloneGameEnded()
	MouseTarget = undefined
	MyNameHero = "npc_dota_hero_lina"
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
export function Tick() {
	let initItems = initItemsMap.get(Owner)
	if (initItems === undefined) {
		initItems = new ItemsX(Owner)
		initItemsMap.set(Owner, initItems)
	}
	let initAbility = initAbilityMap.get(Owner)
	if (initAbility === undefined) {
		initAbility = new AbilityX(Owner)
		initAbilityMap.set(Owner, initAbility)
	}
	let initDrawBase = initDrawMap.get(Owner)
	if (initDrawBase === undefined) {
		initDrawBase = new InitDraw(Owner)
		initDrawMap.set(Owner, initDrawBase)
	}
	let initinitHitAndRun = initHitAndRunMap.get(Owner)
	if (initinitHitAndRun === undefined) {
		initinitHitAndRun = new HitAndRun(Owner)
		initHitAndRunMap.set(Owner, initinitHitAndRun)
	}
}