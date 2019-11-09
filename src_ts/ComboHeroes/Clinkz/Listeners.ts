import { ArrayExtensions, Entity, Hero, TrackingProjectile, Utils, Unit } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { NearMouse, State } from "./Menu"
import { GameEndedCombo } from "./Module/Combo"
import { HarassGameEdned } from "./Module/Harras"
import { DeleteLinkenBreakAllVars } from "./Module/LinkenBreaker"

import InitItems from "./Extends/Items"
import InitAbilities from "./Extends/Abilities"
import InitDraw from "./Extends/Draw"

export let Heroes: Hero[] = []
export let Owner: Hero
export let MouseTarget: Hero

export const initItemsMap = new Map<Unit, InitItems>()
export const initItemsTargetMap = new Map<Unit, InitItems>()
export const initAbilityMap = new Map<Unit, InitAbilities>()
export const initDrawBaseMap = new Map<Unit, InitDraw>()


export let ProjList: TrackingProjectile[] = []
export let MyNameHero: string = "npc_dota_hero_clinkz"

export function InitMouse() {
	if (!Base.IsRestrictions(State))
		return false
	MouseTarget = ArrayExtensions.orderBy(
		Heroes.filter(x => x.IsEnemy() && x.Distance(Utils.CursorWorldVec) <= NearMouse.value && x.IsAlive),
		x => x.Distance(Utils.CursorWorldVec),
	)[0]
}

function MapClear() {
	initItemsMap.clear()
	initAbilityMap.clear()
	initDrawBaseMap.clear()
	initItemsTargetMap.clear()
	new InitDraw().GameEndedParticleRemove()
}

export function GameEnded() {
	MapClear()
	Heroes = []
	GameEndedCombo()
	HarassGameEdned()
	Owner = undefined
	MouseTarget = undefined
	DeleteLinkenBreakAllVars()
}

export function GameStarted(hero: Hero) {
	if (Owner === undefined && hero.Name === MyNameHero)
		Owner = hero
}

export function EntityCreated(x: Entity) {
	if (x instanceof Hero && !x.IsIllusion)
		Heroes.push(x)
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Hero)
		ArrayExtensions.arrayRemove(Heroes, x)
}

export function TrackingProjectileCreated(proj: TrackingProjectile) {
	if (!Base.IsRestrictions(State))
		return false

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

export function Tick() {
	let initItemsTarget = initItemsTargetMap.get(MouseTarget)
	if (initItemsTarget === undefined) {
		initItemsTarget = new InitItems(MouseTarget)
		initItemsTargetMap.set(MouseTarget, initItemsTarget)
	}
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
		initDrawBase = new InitDraw(Owner)
		initDrawBaseMap.set(Owner, initDrawBase)
	}
}