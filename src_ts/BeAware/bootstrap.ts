import { EventsSDK, Game } from "wrapper/Imports"
import { stateMain } from "./abstract/Menu.Base"
import * as Camp from "./Module/CampInformer/Entity"
import * as Jungle from "./Module/JungleMapHack/Particle"
import * as ParticleHack from "./Module/ParticleMapHack/Particle"
import * as Roshan from "./Module/Roshan/Particle"
import * as Techies from "./Module/TechiesMapHack/Particle"
import * as Treant from "./Module/TreantMapHack/Particle"
import * as Wisp from "./Module/WispMapHack/Particle"
// import * as TopHud from "./Module/TopHud/Entities"

EventsSDK.on("Tick", () => {
	if (!stateMain.value || Game.IsPaused)
		return
	if (!Treant.Tick())
		return false
})
EventsSDK.on("Draw", () => {
	if (!stateMain.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	Camp.OnDraw()
	Wisp.OnDraw()
	// TopHud.Draw()
	Roshan.Draw()
	Jungle.OnDraw()
	Techies.OnDraw()
	ParticleHack.OnDraw()
})

EventsSDK.on("GameStarted", () => {
	// TopHud.gameStarted()
})

EventsSDK.on("GameEnded", () => {
	// TopHud.gameEnded()
	Camp.GameEnded()
	Wisp.GameEnded()
	Treant.GameEnded()
	Jungle.GameEnded()
	Techies.GameEnded()
	ParticleHack.GameEnded()
})

EventsSDK.on("GameConnected", () => {
	ParticleHack.GameConnect()
})
