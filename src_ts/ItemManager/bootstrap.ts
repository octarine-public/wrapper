import { EventsSDK, Game } from "wrapper/Imports"
import { StateBase } from "./abstract/MenuBase"
import ItemManagerBase from "./abstract/Base"
import * as AutoDeward from "./module/AutoDeward/Helper"
import * as AutoItems from "./module/AutoItems/Helper"
let LocalPlayer = new ItemManagerBase()

EventsSDK.on("Tick", () => {
	if (LocalPlayer.IsSpectator)
		return false
	if (!StateBase.value || !Game.IsInGame || Game.IsPaused)
		return false
	AutoItems.Tick()
	AutoDeward.Tick()
})

EventsSDK.on("GameStarted", () => {
	if (LocalPlayer.IsSpectator)
		return false
	AutoItems.GameStart()
})
EventsSDK.on("GameEnded", () => {
	if (LocalPlayer.IsSpectator)
		return false
	AutoItems.GameEnded()
	AutoDeward.GameEnded()
})
