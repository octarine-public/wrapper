import { EventsSDK } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { InitFindCyclone } from "./Module/AutoArray"
import { InitAutoSteal } from "./Module/AutoSteal"
import { InitCombo } from "./Module/Combo"
//import { OnExecuteOrder } from "./Module/WithoutFail"
import { Draw } from "./Renderer"

EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("EntityCreated", EntityCreated)
EventsSDK.on("EntityDestroyed", EntityDestroyed)
//EventsSDK.on("PrepareUnitOrders", OnExecuteOrder)

EventsSDK.on("Tick", () => {
	InitMouse()
	if (Base.DeadInSide) {
		return false
	}
	InitCombo()
	InitFindCyclone()
	InitAutoSteal()
})

import {
	EntityCreated,
	EntityDestroyed,
	GameEnded, GameStarted, InitMouse,
} from "./Listeners"
