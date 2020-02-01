import { Unit, EventsSDK } from "wrapper/Imports"
import { InfoPanel } from "./module/Renderer"
import { InitVisual, InitModuleTick } from "./module/index"
import { RegisterHeroModule, orderByFromUnit, XAIOParticleMap } from "../bootstrap"
import { XAIONearMouse, XAIOState, XAIORenderOptimizeType, SkyAutoComboInRadius } from "./Menu"
import { WithoutFail } from "./module/WithoutFail"

RegisterHeroModule("npc_dota_hero_skywrath_mage", {
	InitTick,
	InitDraw
})

function InitTick(unit: Unit) {
	if (unit === undefined || !unit.IsAlive)
		return

	if (XAIORenderOptimizeType.selected_id === 1) {
		let par = XAIOParticleMap.get(unit)
		if (par !== undefined)
			InitVisual(par)
	}

	if (!XAIOState.value)
		return

	InitModuleTick(unit,
		orderByFromUnit(XAIONearMouse.value),
		orderByFromUnit(SkyAutoComboInRadius.value, unit)
	)
}

function InitDraw(unit: Unit) {
	InfoPanel()
	if (XAIORenderOptimizeType.selected_id === 0) {
		let par = XAIOParticleMap.get(unit)
		if (par === undefined)
			return
		InitVisual(par)
	}
}

EventsSDK.on("PrepareUnitOrders", WithoutFail)