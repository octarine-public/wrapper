import * as AutoFeed from "./AutoFeed/Listeners";
import * as AutoLaugh from "./AutoLaugh/Listeners";
import * as AutoTaunt from "./AutoTaunt/Listeners";
import { EventsSDK, LocalPlayer, Game } from "../wrapper/Imports";
import { MainState } from "./Base/MenuBase";

EventsSDK.on("Tick", () => {
	if (!MainState.value || LocalPlayer === undefined
		|| LocalPlayer.IsSpectator || !Game.IsInGame)
		return
	AutoFeed.Tick()
	AutoLaugh.Tick()
	AutoTaunt.Tick()
})
EventsSDK.on("Draw", () => {
	if (!MainState.value || LocalPlayer === undefined 
	|| LocalPlayer.IsSpectator || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || !Game.IsInGame)
		return
	AutoFeed.Draw()
})
EventsSDK.on("EntityCreated", x => {
	AutoFeed.EntityCreated(x)
})
EventsSDK.on("EntityDestroyed", x => {
	AutoFeed.EntityDestroyed(x)
})