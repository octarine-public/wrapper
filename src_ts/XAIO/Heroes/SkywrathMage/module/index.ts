
import { Unit, EventsSDK } from "wrapper/Imports"
import { ParticleRadius } from "./Renderer"

import XAIOParticle from "XAIO/Core/Draw"
import { XIAOSKYSmartBolt } from "./SmartBolt"
import { XIAOSKYSafeCyclone } from "./CycloneSafe"
import { SkyUseCycloneBladMailState } from "../Menu"
import { XIAOSKYCombo, XIAOSKYAutoCombo } from "./Combo"

export let EnemyMouse: Nullable<Unit>
export let InitVisual = (Particle: XAIOParticle) => ParticleRadius(Particle)

export function InitModuleTick(unit: Unit, targetMouse: Unit, targetInRange: Unit) {
	EnemyMouse = targetMouse

	XIAOSKYSafeCyclone(unit, targetInRange)

	if (targetMouse
		&& SkyUseCycloneBladMailState.value
		&& targetMouse.HasBuffByName("modifier_item_blade_mail_reflect"))
		return

	XIAOSKYCombo(unit, targetMouse)
	XIAOSKYSmartBolt(unit, targetMouse)
	XIAOSKYAutoCombo(unit, targetInRange)

}

EventsSDK.on("GameEnded", () => {
	EnemyMouse = undefined
})
