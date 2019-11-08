import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { InitCombo } from "./Module/Combo"
import { Draw } from "./Renderer"
import { Tick, EntityCreated, EntityDestroyed, GameEnded, GameStarted, InitMouse } from "./Listeners"
function Init() {
	Tick()
	InitMouse()
	if (!Base.DeadInSide) {
		InitCombo()
	}
}
EventsSDK.on("Tick", Init)
EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("EntityCreated", EntityCreated)
EventsSDK.on("EntityDestroyed", EntityDestroyed)

