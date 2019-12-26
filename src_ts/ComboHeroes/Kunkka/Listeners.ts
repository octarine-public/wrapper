//@ts-nocheck
import { ArrayExtensions, Hero, Utils, Unit, EntityManager } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { NearMouse, State } from "./Menu"
import { ComboGameEnded } from "./Module/Combo"
import { DrawDeleteTempAllVars } from "./Renderer"

export let Owner: Hero
export let MouseTarget: Hero
export let MyNameHero: string = "npc_dota_hero_kunkka"

import InitDraw from "./Extends/Draw"
import InitItems from "./Extends/Items"
import InitAbilities from "./Extends/Abilities"

export const initItemsMap = new Map<Unit, InitItems>()
export const initItemsTargetMap = new Map<Unit, InitItems>()
export const initAbilityMap = new Map<Unit, InitAbilities>()
export const initDrawMap = new Map<Unit, InitDraw>()

export function InitMouse() {
	if (!Base.IsRestrictions(State))
		return false
	MouseTarget = ArrayExtensions.orderBy(
		EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
			.filter(x => x.Distance(Utils.CursorWorldVec) <= NearMouse.value && x.IsAlive),
		x => x.Distance(Utils.CursorWorldVec),
	)[0]
}

export function GameStarted(hero: Hero) {
	if (Owner === undefined && hero.Name === MyNameHero)
		Owner = hero
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
	ComboGameEnded()
	Owner = undefined
	MouseTarget = undefined
	DrawDeleteTempAllVars()
	MyNameHero = "npc_dota_hero_kunkka"
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
	let initDrawBase = initDrawMap.get(Owner)
	if (initDrawBase === undefined) {
		initDrawBase = new InitDraw(Owner)
		initDrawMap.set(Owner, initDrawBase)
	}
}