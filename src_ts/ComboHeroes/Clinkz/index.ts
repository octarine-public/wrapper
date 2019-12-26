//@ts-nocheck
import { EventsSDK } from "wrapper/Imports"
import { Draw } from "./Renderer"
import { Base } from "./Extends/Helper"
import { InitCombo } from "./Module/Combo"
import { InitHarass } from "./Module/Harras"
import { InitAutoDeathPact } from "./Module/AutoDeathPact"
import { Tick, GameStarted, GameEnded, InitMouse } from "./Listeners"
EventsSDK.on("Tick", () => {
	Tick()
	InitMouse()
	InitAutoDeathPact()
	if (!Base.DeadInSide) {
		InitHarass()
		InitCombo()
	}
})
EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
