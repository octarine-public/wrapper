
import { EventsSDK, Game, LocalPlayer, DOTAGameUIState_t } from "wrapper/Imports"
import * as AutoFeed from "./AutoFeed/Listeners"
import * as AutoLaugh from "./AutoLaugh/Listeners"
import * as AutoSpinner from "./AutoSpinner/Listeners"
import * as AutoTaunt from "./AutoTaunt/Listeners"
import { MainState } from "./Base/MenuBase"

EventsSDK.on("Tick", () => {
	if (!MainState.value || LocalPlayer!.IsSpectator)
		return
	AutoFeed.Tick()
	AutoLaugh.Tick()
	AutoTaunt.Tick()
	AutoSpinner.Tick()
})
EventsSDK.on("Draw", () => {
	if (
		!MainState.value
		|| LocalPlayer === undefined
		|| LocalPlayer.IsSpectator
		|| Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME
		|| !Game.IsInGame
	)
		return
	AutoFeed.Draw()
})

EventsSDK.on("GameEnded", () => {
	AutoFeed.GameEnded()
	AutoTaunt.GameEnded()
	AutoLaugh.GameEnded()
})

EventsSDK.on("EntityCreated", x => {
	AutoFeed.EntityCreate(x)
})
EventsSDK.on("EntityDestroyed", x => {
	AutoFeed.EntityDestroyed(x)
})