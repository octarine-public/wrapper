import { Unit, EventsSDK } from "wrapper/Imports"
import XAIOParticle from "../../../Core/Draw"
import { ParticleRadius } from "../module/Renderer"
import { XAIOvoidSpiritCombo } from "./Combo"
import { XAIOSettingsBladMailState } from "../Menu"

export let EnemyMouse: Nullable<Unit>

export let InitModuleDraw = (Particle: XAIOParticle) => ParticleRadius(Particle)

export function InitModuleTick(unit: Unit, targetMouse: Unit) {
	EnemyMouse = targetMouse

	if (XAIOSettingsBladMailState.value && targetMouse.HasBuffByName("modifier_item_blade_mail_reflect"))
		return

	XAIOvoidSpiritCombo(unit, targetMouse)
}

EventsSDK.on("GameEnded", () => {
	EnemyMouse = undefined
})