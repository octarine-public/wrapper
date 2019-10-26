import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import {
	EntityCreated, EntityDestroyed, GameEnded,
	GameStarted, InitMouse,
	LinearProjectileDestroyed,
	TrackingProjectileCreated
} from "./Listeners"

import { Draw } from "./Renderer"
import { InitCombo } from "./Module/Combo"
import { AutoUsage } from "./Module/SpamMode"
import { AutoCombo } from "./Module/AutoCombo"
import { OnExecuteOrder } from "./Module/WithoutFail"
import { AutoDisable, ParticleCreated } from "./Module/AutoDisable"

EventsSDK.on("Tick", () => {
	InitMouse()
	if(Base.DeadInSide)
		return false
	InitCombo()
	AutoCombo()
	AutoUsage()
	AutoDisable()
})

EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("EntityCreated", EntityCreated)
EventsSDK.on("EntityDestroyed", EntityDestroyed)
EventsSDK.on("PrepareUnitOrders", OnExecuteOrder)
EventsSDK.on("ParticleCreated", ParticleCreated)
EventsSDK.on("TrackingProjectileCreated", TrackingProjectileCreated)
EventsSDK.on("TrackingProjectileDestroyed", LinearProjectileDestroyed)
