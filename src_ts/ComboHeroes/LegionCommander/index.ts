import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { InitCombo } from "./Module/Combo"
import { Draw } from "./Renderer"

EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("EntityCreated", EntityCreated)
EventsSDK.on("EntityDestroyed", EntityDestroyed)
EventsSDK.on("TrackingProjectileCreated", TrackingProjectileCreated)
EventsSDK.on("TrackingProjectileDestroyed", LinearProjectileDestroyed)

EventsSDK.on("Tick", () => {
	if (Base.DeadInSide) {
		return false
	}
	InitMouse()
	InitCombo()
})

import {
	EntityCreated,
	EntityDestroyed,
	GameEnded, GameStarted,
	InitMouse, LinearProjectileDestroyed, TrackingProjectileCreated,
} from "./Listeners"
