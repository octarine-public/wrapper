
import { Entity, EventsSDK, Game, LocalPlayer } from "wrapper/Imports";
import * as AutoFeed from "./AutoFeed/Listeners";
import * as AutoLaugh from "./AutoLaugh/Listeners";
import * as AutoSpinner from "./AutoSpinner/Listeners";
import * as AutoTaunt from "./AutoTaunt/Listeners";
import * as BaseListeners from "./Base/ListenersBase";
import { MainState } from "./Base/MenuBase";

EventsSDK.on("Tick", () => {
	if (!MainState.value || LocalPlayer === undefined || LocalPlayer.IsSpectator || !Game.IsInGame)
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
EventsSDK.on("EntityCreated", x => {
	BaseListeners.EntityCreated(x)
})
EventsSDK.on("EntityDestroyed", x => {
	BaseListeners.EntityDestroyed(x)
})
EventsSDK.on("GameStarted", hero => {
	AutoLaugh.GameStarted(hero)
	AutoTaunt.GameStarted(hero)
})
EventsSDK.on("GameEnded", () => {
	AutoFeed.GameEnded()
	AutoTaunt.GameEnded()
	AutoLaugh.GameEnded()
	BaseListeners.GameEnded()
})