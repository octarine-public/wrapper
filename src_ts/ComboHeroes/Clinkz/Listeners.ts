//@ts-nocheck
import { ArrayExtensions, Entity, Hero, TrackingProjectile, Utils, Unit, EntityManager } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { NearMouse, State } from "./Menu"
import { GameEndedCombo } from "./Module/Combo"

import InitDraw from "./Extends/Draw"
import InitItems from "./Extends/Items"
import HitAndRun from "./Extends/HitAndRun"
import InitAbilities from "./Extends/Abilities"

export let Owner: Hero
export let MouseTarget: Hero

export const initItemsMap = new Map<Unit, InitItems>()
export const initItemsTargetMap = new Map<Unit, InitItems>()
export const initHitAndRunMap = new Map<Unit, HitAndRun>()
export const initAbilityMap = new Map<Unit, InitAbilities>()
export const initDrawBaseMap = new Map<Unit, InitDraw>()

export let ProjList: TrackingProjectile[] = []
export let MyNameHero: string = "npc_dota_hero_clinkz"

export function InitMouse() {
	if (!Base.IsRestrictions(State))
		return false
	MouseTarget = ArrayExtensions.orderBy(
		EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).filter(x => x.Distance(Utils.CursorWorldVec)
			<= NearMouse.value && x.IsAlive),
		x => x.Distance(Utils.CursorWorldVec),
	)[0]
}

function MapClear() {
	initItemsMap.clear()
	initAbilityMap.clear()
	initDrawBaseMap.clear()
	initHitAndRunMap.clear()
	initItemsTargetMap.clear()
	new HitAndRun().ClearVars()
	new InitDraw().GameEndedParticleRemove()
}

export function GameEnded() {
	MapClear()
	GameEndedCombo()
	Owner = undefined
	MouseTarget = undefined
}

export function GameStarted(hero: Hero) {
	if (Owner === undefined && hero.Name === MyNameHero)
		Owner = hero
}

export function TrackingProjectileCreated(proj: TrackingProjectile) {
	if (!Base.IsRestrictions(State)) {
		return
	}
	let entity = proj.Source as Entity
	if (
		proj instanceof TrackingProjectile
		&& entity instanceof Hero
		&& !entity.IsEnemy()
		&& entity.Name === MyNameHero
	) {
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
	let initinitHitAndRun = initHitAndRunMap.get(Owner)
	if (initinitHitAndRun === undefined) {
		initinitHitAndRun = new HitAndRun(Owner)
		initHitAndRunMap.set(Owner, initinitHitAndRun)
	}
}
