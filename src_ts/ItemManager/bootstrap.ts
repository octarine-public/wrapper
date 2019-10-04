import { EventsSDK, LocalPlayer } from "wrapper/Imports"
import * as AutoDeward from "./module/AutoDeward/Helper"
import * as AutoItems from "./module/AutoItems/Helper"

EventsSDK.on("Tick", () => {
	if (LocalPlayer === undefined) {
		return false
	}
	if (!LocalPlayer.IsSpectator) {
		AutoItems.Tick()
		AutoDeward.Tick()
	}
})

EventsSDK.on("GameStarted", () => {
	if (LocalPlayer === undefined) {
		return false
	}
	if (LocalPlayer.IsSpectator) {
		return false
	}
})

EventsSDK.on("GameEnded", () => {
	if (LocalPlayer === undefined) {
		return false
	}
	if (LocalPlayer.IsSpectator) {
		return false
	}
	AutoItems.GameEnded()
	AutoDeward.GameEnded()
})
