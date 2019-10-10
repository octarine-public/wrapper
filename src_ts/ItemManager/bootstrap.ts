import { EventsSDK, LocalPlayer, Game } from "wrapper/Imports"
import * as AutoDeward from "./module/AutoDeward/Helper"
import * as AutoItems from "./module/AutoItems/Helper"

EventsSDK.on("Tick", () => {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || !Game.IsInGame || Game.IsPaused) {
		return false
	}
	AutoItems.Tick()
	AutoDeward.Tick()
})

EventsSDK.on("GameStarted", () => {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator) {
		return false
	}
})

EventsSDK.on("GameEnded", () => {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator) {
		return false
	}
	AutoItems.GameEnded()
	AutoDeward.GameEnded()
})
