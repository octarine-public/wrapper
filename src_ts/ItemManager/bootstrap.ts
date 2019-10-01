import { EventsSDK, Game } from "wrapper/Imports"
import ItemManagerBase from "./abstract/Base"
import * as AutoDeward from "./module/AutoDeward/Helper"
import * as AutoItems from "./module/AutoItems/Helper"
let LocalPlayer = new ItemManagerBase()

EventsSDK.on("Tick", () => {
	if (!LocalPlayer.IsSpectator) {
		AutoItems.Tick()
		AutoDeward.Tick()
	}
})

EventsSDK.on("GameStarted", () => {
	if (LocalPlayer.IsSpectator)
		return false
})

EventsSDK.on("GameEnded", () => {
	if (LocalPlayer.IsSpectator)
		return false
	AutoItems.GameEnded()
	AutoDeward.GameEnded()
})
