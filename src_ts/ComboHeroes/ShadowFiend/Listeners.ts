import { ArrayExtensions, Hero, Utils, Unit, EntityManager } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { Menu_Settings_FindTargetRadius, State } from "./Menu"
// import { ComboGameEnded } from "./Module/Combo"

export let Owner: Hero
export let MouseTarget: Hero
export let MyNameHero: string = "npc_dota_hero_nevermore"

import InitDraw from "./Extends/Draw"
import ItemsX from "./Extends/Items"
import AbilityX from "./Extends/Abilities"
import HitAndRun from "./Extends/HitAndRun"
import { HarassGameEdned } from "./Module/Harras"

export const initDrawMap = new Map<Unit, InitDraw>()
export const initItemsMap = new Map<Unit, ItemsX>()
export const initHitAndRunMap = new Map<Unit, HitAndRun>()
export const initAbilityMap = new Map<Unit, AbilityX>()

export function InitMouse() {
	if (!Base.IsRestrictions(State))
		return
	MouseTarget = ArrayExtensions.orderBy(
		EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).filter(x =>
			x.Distance(Utils.CursorWorldVec) <= Menu_Settings_FindTargetRadius.value && x.IsAlive),
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
	initHitAndRunMap.clear()
	new HitAndRun().ClearVars()
	new InitDraw().GameEndedParticleRemove()
}
export function GameEnded() {
	MapClear()
	Owner = undefined
	MouseTarget = undefined
	// ComboGameEnded()
	HarassGameEdned()
	MyNameHero = "npc_dota_hero_nevermore"
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
