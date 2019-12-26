//@ts-nocheck
import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { InitCombo } from "./Module/Combo"
import { Draw } from "./Renderer"
import { Tick, GameEnded, InitMouse, GameStarted, } from "./Listeners"
EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("Tick", () => {
	Tick()
	InitMouse()
	if (!Base.DeadInSide) {
		InitCombo()
	}
})
