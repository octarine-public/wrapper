import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { InitCombo } from "./Module/Combo"
import { InitHarass } from "./Module/Harras"
import { Draw } from "./Renderer"

EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("EntityCreated", EntityCreated)
EventsSDK.on("EntityDestroyed", EntityDestroyed)
// EventsSDK.on("TrackingProjectileCreated", TrackingProjectileCreated)
// EventsSDK.on("TrackingProjectileDestroyed", LinearProjectileDestroyed)

EventsSDK.on("Tick", () => {
	Tick()
	InitMouse()
	if (!Base.DeadInSide) {
		InitHarass()
		InitCombo()
	}
})

import {
	EntityCreated,
	EntityDestroyed,
	GameEnded, GameStarted,
	InitMouse,
	Tick, //, LinearProjectileDestroyed, TrackingProjectileCreated,
} from "./Listeners"
