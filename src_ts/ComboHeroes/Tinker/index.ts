import { EventsSDK } from "wrapper/Imports";
import { Base } from "./Extends/Helper";
import { EntityCreated, EntityDestroyed, GameEnded, GameStarted, InitMouse} from "./Listeners";
import { comboKey } from "./MenuManager";
import { AutoSteal } from "./Module/EZKill";
import { fastBlink } from "./Module/fastBlink";
//import { Push } from "./Module/Autopush";
import { MainCombo } from "./Module/MainCombo";
import { Spam } from "./Module/Spam";
import { OnExecuteOrder } from "./Module/WithoutFail";
import { Draw } from "./Renderer";

EventsSDK.on("Tick", () => {
	if(Base.DeadInSide) {
		return false
	}
	InitMouse()
	MainCombo()
	AutoSteal()
	Spam()
	fastBlink()
	//Push(),
	AutoSteal()
})
EventsSDK.on("Draw", Draw)
EventsSDK.on("GameEnded", GameEnded)
EventsSDK.on("GameStarted", GameStarted)
EventsSDK.on("EntityCreated", EntityCreated)
EventsSDK.on("EntityDestroyed", EntityDestroyed)
EventsSDK.on("PrepareUnitOrders", OnExecuteOrder)