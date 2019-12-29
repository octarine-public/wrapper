
import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { InitFindCyclone, OnExecuteOrder } from "./Module/AutoArray"
import { InitAutoSteal } from "./Module/AutoSteal"
import { InitCombo } from "./Module/Combo"
import { Draw } from "./Renderer"
import { Tick, GameEnded, GameStarted, InitMouse } from "./Listeners"

EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("PrepareUnitOrders", OnExecuteOrder)
EventsSDK.on("Tick", () => {
	Tick()
	InitMouse()
	if (!Base.DeadInSide) {
		InitCombo()
		InitFindCyclone()
		InitAutoSteal()
	}
})
