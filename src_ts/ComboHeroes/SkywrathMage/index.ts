import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import {
	EntityCreated, EntityDestroyed, GameEnded,
	GameStarted, InitMouse,
	LinearProjectileDestroyed,
	TrackingProjectileCreated,
} from "./Listeners"
import { AutoCombo } from "./Module/AutoCombo"
import { AutoDisable } from "./Module/AutoDisable"
import { InitCombo } from "./Module/Combo"
import { AutoUsage } from "./Module/SpamMode"
import { OnExecuteOrder } from "./Module/WithoutFail"
import { Draw } from "./Renderer"

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
EventsSDK.on("TrackingProjectileCreated", TrackingProjectileCreated)
EventsSDK.on("TrackingProjectileDestroyed", LinearProjectileDestroyed)
