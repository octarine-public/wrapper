import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { InitCombo } from "./Module/Combo"
import { Draw } from "./Renderer"
import {
	EntityCreated,
	EntityDestroyed,
	GameEnded, GameStarted, InitMouse, 
	LinearProjectileDestroyed, TrackingProjectileCreated, Tick,
} from "./Listeners"

EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("EntityCreated", EntityCreated)
EventsSDK.on("EntityDestroyed", EntityDestroyed)
EventsSDK.on("TrackingProjectileCreated", TrackingProjectileCreated)
EventsSDK.on("TrackingProjectileDestroyed", LinearProjectileDestroyed)

EventsSDK.on("Tick", () => {
	Tick()
	InitMouse()
	if (!Base.DeadInSide) {
		InitCombo()
	}
})