import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { InitCombo } from "./Module/Combo"
import { Draw } from "./Renderer"

EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("EntityCreated", EntityCreated)
EventsSDK.on("EntityDestroyed", EntityDestroyed)

EventsSDK.on("Tick", () => {
	InitMouse()
	if (Base.DeadInSide) {
		return false
	}	
	InitCombo()
})

import {
	EntityCreated,
	EntityDestroyed,
	GameEnded, GameStarted, InitMouse
} from "./Listeners"
