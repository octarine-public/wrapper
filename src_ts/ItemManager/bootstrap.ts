import { EventsSDK, Game, LocalPlayer } from "wrapper/Imports"
import * as AutoDeward from "./module/AutoDeward/Helper"
import * as AutoGlyph from "./module/AutoGlyph/Helper"
import * as AutoItems from "./module/AutoItems/Helper"

EventsSDK.on("Tick", () => {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || !Game.IsInGame)
		return false

	AutoGlyph.Tick()
	AutoItems.Tick()
	AutoDeward.Tick()
})

EventsSDK.on("GameEnded", () => {
	AutoGlyph.GameEnded()
	AutoItems.GameEnded()
	AutoDeward.GameEnded()
})
