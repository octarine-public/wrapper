import { EventsSDK, Game } from "wrapper/Imports"
import { StateBase } from "./abstract/MenuBase"
import * as AutoItems from "./module/AutoItems/Helper"

EventsSDK.on("Tick", () => {
	if (!StateBase.value || !Game.IsInGame || Game.IsPaused)
		return false

	AutoItems.Tick()

})
EventsSDK.on("Draw", () => {
	if (!StateBase.value || !Game.IsInGame || Game.IsPaused)
		return

})

EventsSDK.on("GameStarted", () => {
	AutoItems.GameStart()
})

EventsSDK.on("GameEnded", () => {
	AutoItems.GameEnded()
})
