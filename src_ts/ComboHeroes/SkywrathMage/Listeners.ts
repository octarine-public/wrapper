import {
	ArrayExtensions, Creep, Entity,
	Hero, TrackingProjectile, Utils, Unit,
} from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { NearMouse, State } from "./Menu"
import { AutoComboDeleteVars } from "./Module/AutoCombo"
import { AutoDisableDeleteVars } from "./Module/AutoDisable"
import { ComboDeleteVarsTemp } from "./Module/Combo"
import { LinkenBreakerDeleteVars } from "./Module/LinkenBreaker"
import { AutoModeDeleteVars } from "./Module/SpamMode"
import { WithoutFailDestroy } from "./Module/WithoutFail"

export let Heroes: Hero[] = []
export let Creeps: Creep[] = []

export let MyHero: Hero
export let MouseTarget: Hero
export let ProjList: TrackingProjectile[] = []
export let MyNameHero: string = "npc_dota_hero_skywrath_mage"

import InitDraw from "./Extends/Draw"
import InitItems from "./Extends/Items"
import InitAbilities from "./Extends/Abilities"

export const initItemsMap = new Map<Unit, InitItems>()
export const initItemsTargetMap = new Map<Unit, InitItems>()
export const initAbilityMap = new Map<Unit, InitAbilities>()
export const initDrawMap = new Map<Unit, InitDraw>()


export function InitMouse() {
	if (!Base.IsRestrictions(State)) {
		return
	}
	MouseTarget = ArrayExtensions.orderBy(
		Heroes.filter(x => x.IsEnemy() && x.Distance(Utils.CursorWorldVec) <= NearMouse.value && x.IsAlive),
		x => x.Distance(Utils.CursorWorldVec),
	)[0]
}
function MapClear() {
	initItemsMap.clear()
	initAbilityMap.clear()
	initDrawMap.clear()
	initItemsTargetMap.clear()
	new InitDraw().GameEndedParticleRemove()
}
export function GameEnded() {
	MapClear()
	Heroes = []
	Creeps = []
	ProjList = []
	MyHero = undefined
	MouseTarget = undefined
	WithoutFailDestroy()
	AutoModeDeleteVars()
	ComboDeleteVarsTemp()
	AutoComboDeleteVars()
	AutoDisableDeleteVars()
	LinkenBreakerDeleteVars()
	MyNameHero = "npc_dota_hero_skywrath_mage"
}

export function GameStarted(hero: Hero) {
	if (MyHero === undefined && hero.Name === MyNameHero) {
		MyHero = hero
	}
}

export function EntityCreated(x: Entity) {
	if (x instanceof Hero && !x.IsIllusion)
		Heroes.push(x)
	if (x instanceof Creep)
		Creeps.push(x)
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Hero)
		ArrayExtensions.arrayRemove(Heroes, x)
	if (x instanceof Creep)
		ArrayExtensions.arrayRemove(Creeps, x)
}

export function TrackingProjectileCreated(proj: TrackingProjectile) {
	if (!Base.IsRestrictions(State)) {
		return
	}
	let entity = proj.Source as Entity
	if (
		proj instanceof TrackingProjectile
		&& entity instanceof Hero
		&& !entity.IsEnemy() && entity.Name === MyNameHero
	) {
		ProjList.push(proj)
	}
}

export function LinearProjectileDestroyed(proj: TrackingProjectile) {
	if (proj instanceof TrackingProjectile && !proj.IsAttack) {
		ArrayExtensions.arrayRemove(ProjList, proj)
	}
}

export function Tick() {
	let initItemsTarget = initItemsTargetMap.get(MouseTarget)
	if (initItemsTarget === undefined) {
		initItemsTarget = new InitItems(MouseTarget)
		initItemsTargetMap.set(MouseTarget, initItemsTarget)
	}
	let initItems = initItemsMap.get(MyHero)
	if (initItems === undefined) {
		initItems = new InitItems(MyHero)
		initItemsMap.set(MyHero, initItems)
	}
	let initAbility = initAbilityMap.get(MyHero)
	if (initAbility === undefined) {
		initAbility = new InitAbilities(MyHero)
		initAbilityMap.set(MyHero, initAbility)
	}
	let initDrawBase = initDrawMap.get(MyHero)
	if (initDrawBase === undefined) {
		initDrawBase = new InitDraw(MyHero)
		initDrawMap.set(MyHero, initDrawBase)
	}
}