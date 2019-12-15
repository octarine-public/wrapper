
import { EventsSDK, Game, LocalPlayer, DOTAGameUIState_t } from "wrapper/Imports"
import * as AutoFeed from "./AutoFeed/Listeners"
import * as AutoLaugh from "./AutoLaugh/Listeners"
import * as AutoSpinner from "./AutoSpinner/Listeners"
import * as AutoTaunt from "./AutoTaunt/Listeners"
import { MainState } from "./Base/MenuBase"

EventsSDK.on("Tick", () => {
	if (!MainState.value || LocalPlayer === undefined || LocalPlayer.IsSpectator || !Game.IsInGame)
		return
	// Game.StockInfo.filter(x => {
	// 	if (x.AbilityID !== 257)
	// 		return
	// 	console.log(x.Count)
	// })
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
EventsSDK.on("GameStarted", hero => {
	AutoLaugh.GameStarted(hero)
	AutoTaunt.GameStarted(hero)
})
EventsSDK.on("GameEnded", () => {
	AutoFeed.GameEnded()
	AutoTaunt.GameEnded()
	AutoLaugh.GameEnded()
})