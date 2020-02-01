import { Unit, EventsSDK } from "wrapper/Imports"
import XAIOParticle from "XAIO/Core/Draw/Draw"
import { ParticleRadius } from "../module/Renderer"
import { XAIOvoidSpiritCombo } from "./Combo"

export let EnemyMouse: Nullable<Unit>

export let InitModuleDraw = (Particle: XAIOParticle) => ParticleRadius(Particle)

export function InitModuleTick(unit: Unit, targetMouse: Nullable<Unit>) {
	EnemyMouse = targetMouse
	XAIOvoidSpiritCombo(unit, targetMouse)
}

EventsSDK.on("GameEnded", () => {
	EnemyMouse = undefined
})