//@ts-nocheck
import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { Draw } from "./Renderer"
import { InitCombo } from "./Module/Combo"
import { AutoUsage } from "./Module/SpamMode"
import { AutoCombo } from "./Module/AutoCombo"
import { OnExecuteOrder } from "./Module/WithoutFail"
import { AutoDisable, ParticleCreated } from "./Module/AutoDisable"
import { Tick, GameEnded, GameStarted, InitMouse, LinearProjectileDestroyed, TrackingProjectileCreated } from "./Listeners"

EventsSDK.on("Tick", () => {
	Tick()
	InitMouse()
	if (!Base.DeadInSide) {
		InitCombo()
		AutoCombo()
		AutoUsage()
		AutoDisable()
	}
})

EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("PrepareUnitOrders", OnExecuteOrder)
EventsSDK.on("ParticleCreated", ParticleCreated)
EventsSDK.on("TrackingProjectileCreated", TrackingProjectileCreated)
EventsSDK.on("TrackingProjectileDestroyed", LinearProjectileDestroyed)
