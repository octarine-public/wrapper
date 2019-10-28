import { Draw } from "./Renderer";
import { Base } from "./Extends/Helper";
//import { Push } from "./Module/Autopush";
import { MainCombo } from "./Module/MainCombo";
import { EventsSDK } from "wrapper/Imports";
import { Spam } from "./Module/Spam";
import { fastBlink } from "./Module/fastBlink";
import { OnExecuteOrder } from "./Module/WithoutFail";
import { GameStarted, GameEnded, EntityCreated, EntityDestroyed, InitMouse} from "./Listeners";
import { AutoSteal } from "./Module/EZKill";
import { comboKey } from "./MenuManager";

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