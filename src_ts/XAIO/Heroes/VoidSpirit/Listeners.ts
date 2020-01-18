import { Unit } from "wrapper/Imports"
import { InitModuleDraw, InitModuleTick } from "./module/index"
import { XAIONearMouse, XAIOState, XAIORenderOptimizeType } from "./Menu"
import { RegisterHeroModule, orderByFromUnit, XAIOParticleMap } from "../bootstrap"

RegisterHeroModule("npc_dota_hero_void_spirit", {
	InitTick,
	InitDraw
})

function XAIOParticleMapGet(unit: Unit) {
	let XAIOParticleMapGet = XAIOParticleMap.get(unit)
	if (XAIOParticleMapGet === undefined)
		return
	InitModuleDraw(XAIOParticleMapGet)
}

function InitTick(unit: Unit) {
	if (unit === undefined || !unit.IsAlive)
		return

	if (XAIORenderOptimizeType.selected_id === 1)
		XAIOParticleMapGet(unit)

	if (!XAIOState.value)
		return

	InitModuleTick(unit, orderByFromUnit(XAIONearMouse.value))
}

function InitDraw(unit: Unit) {
	if (XAIORenderOptimizeType.selected_id === 0)
		XAIOParticleMapGet(unit)
}