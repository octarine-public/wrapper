import { EventsSDK, Game, LocalPlayer } from "wrapper/Imports"
//import * as AutoBuy from "./module/AutoBuy/Helper"
import * as AutoDeward from "./module/AutoDeward/Helper"
import * as AutoGlyph from "./module/AutoGlyph/Helper"
import * as AutoItems from "./module/AutoItems/Helper"
import * as AutoDisable from "./module/AutoDisable/Helper"

EventsSDK.on("Tick", () => {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || !Game.IsInGame)
		return
	//AutoBuy.Init()
	AutoGlyph.Init()
	AutoItems.Init()
	AutoDeward.Init()
	AutoDisable.Init()
})

EventsSDK.on("GameEnded", () => {
	//AutoBuy.GameEnded()
	AutoGlyph.GameEnded()
	AutoItems.GameEnded()
	AutoDeward.GameEnded()
	AutoDisable.GameEnded()
})
