//@ts-nocheck
import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { InitStaker } from "./Module/AutoStacker"
import { InitCombo } from "./Module/Combo"
import { OnExecuteOrder } from "./Module/WithoutFail"
import { Draw } from "./Renderer"
import { Tick, GameEnded, GameStarted, InitMouse } from "./Listeners"

EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("PrepareUnitOrders", OnExecuteOrder)

EventsSDK.on("Tick", () => {
	Tick()
	InitMouse()
	if (!Base.DeadInSide)
		InitCombo()
	InitStaker()
})
