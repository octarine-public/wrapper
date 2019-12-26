//@ts-nocheck
import { ArrayExtensions, Entity, Hero, TrackingProjectile, Utils, Unit, EntityManager } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { NearMouse, State } from "./Menu"
import { AutoDisableDeleteVars } from "./Module/AutoDisable"
import { ComboDeleteVarsTemp } from "./Module/Combo"
import { LinkenBreakerDeleteVars } from "./Module/LinkenBreaker"
import { AutoModeDeleteVars } from "./Module/SpamMode"
import { WithoutFailDestroy } from "./Module/WithoutFail"

export let MyHero: Hero
export let MouseTarget: Hero
export let ProjectileTrigger: boolean = false
export let ProjList: TrackingProjectile[] = []
export let MyNameHero: string = "npc_dota_hero_skywrath_mage"

import InitDraw from "./Extends/Draw"
import ItemsX from "./Extends/Items"
import AbilityX from "./Extends/Abilities"
import HitAndRun from "./Extends/HitAndRun"

export const initItemsMap = new Map<Unit, ItemsX>()
export const initItemsTargetMap = new Map<Unit, ItemsX>()
export const initAbilityMap = new Map<Unit, AbilityX>()
export const initDrawMap = new Map<Unit, InitDraw>()
export const initHitAndRunMap = new Map<Unit, HitAndRun>()

export function InitMouse() {
	if (!Base.IsRestrictions(State))
		return
	MouseTarget = ArrayExtensions.orderBy(
		EntityManager.GetEntitiesByClass
			(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).filter(x =>
				x.IsAlive && x.Distance(Utils.CursorWorldVec) <= NearMouse.value),
		x => x.Distance(Utils.CursorWorldVec)
	)[0]
	ProjectileTrigger = EntityManager.GetEntitiesByClass
		(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).some(x =>
			x.IsAlive
			&& x.Distance(MyHero) <= 1200
			&& !Base.ProjectileActive.IsZero()
			&& x.Distance(Base.ProjectileActive) <= (x.HullRadius * 2) + 100
		)
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
	ProjList = []
	MyHero = undefined
	MouseTarget = undefined
	WithoutFailDestroy()
	AutoModeDeleteVars()
	ComboDeleteVarsTemp()
	AutoDisableDeleteVars()
	LinkenBreakerDeleteVars()
	MyNameHero = "npc_dota_hero_skywrath_mage"
}

export function GameStarted(hero: Hero) {
	if (MyHero === undefined && hero.Name === MyNameHero)
		MyHero = hero
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
		initItemsTarget = new ItemsX(MouseTarget)
		initItemsTargetMap.set(MouseTarget, initItemsTarget)
	}
	let initItems = initItemsMap.get(MyHero)
	if (initItems === undefined) {
		initItems = new ItemsX(MyHero)
		initItemsMap.set(MyHero, initItems)
	}
	let initAbility = initAbilityMap.get(MyHero)
	if (initAbility === undefined) {
		initAbility = new AbilityX(MyHero)
		initAbilityMap.set(MyHero, initAbility)
	}
	let initDrawBase = initDrawMap.get(MyHero)
	if (initDrawBase === undefined) {
		initDrawBase = new InitDraw(MyHero)
		initDrawMap.set(MyHero, initDrawBase)
	}
	let initinitHitAndRun = initHitAndRunMap.get(MyHero)
	if (initinitHitAndRun === undefined) {
		initinitHitAndRun = new HitAndRun(MyHero)
		initHitAndRunMap.set(MyHero, initinitHitAndRun)
	}
}