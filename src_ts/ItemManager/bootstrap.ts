import { EventsSDK, Game, LocalPlayer } from "wrapper/Imports"
import * as AutoDeward from "./module/AutoDeward/Helper"
import * as AutoGlyph from "./module/AutoGlyph/Helper"
import * as AutoItems from "./module/AutoItems/Helper"
import * as AutoDisable from "./module/AutoDisable/Helper"

EventsSDK.on("Tick", () => {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || !Game.IsInGame)
		return
	AutoGlyph.Init()
	AutoItems.Init()
	AutoDeward.Init()
	AutoDisable.Init()
})

EventsSDK.on("GameEnded", () => {
	AutoGlyph.GameEnded()
	AutoItems.GameEnded()
	AutoDeward.GameEnded()
	AutoDisable.GameEnded()
})
