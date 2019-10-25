import { EventsSDK, LocalPlayer, Game } from "wrapper/Imports"
import * as AutoDeward from "./module/AutoDeward/Helper"
import * as AutoItems from "./module/AutoItems/Helper"
import * as AutoGlyph from "./module/AutoGlyph/Helper"

EventsSDK.on("Tick", () => {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || !Game.IsInGame) {
		return false
	}
	AutoGlyph.Tick()
	AutoItems.Tick()
	AutoDeward.Tick()
})

EventsSDK.on("GameStarted", hero => {
	AutoGlyph.GameStarted(hero)
})

EventsSDK.on("GameEnded", () => {
	AutoGlyph.GameEnded()
	AutoItems.GameEnded()
	AutoDeward.GameEnded()
})
