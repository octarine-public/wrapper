import { EventsSDK, Game } from "wrapper/Imports"
import ManagerBase from "./abstract/Base"
import { stateMain } from "./abstract/Menu.Base"
import * as Camp from "./Module/CampInformer/Entity"
import * as Jungle from "./Module/JungleMapHack/Particle"
import * as ParticleHack from "./Module/ParticleMapHack/Particle"
import * as Roshan from "./Module/Roshan/Particle"
import * as Techies from "./Module/TechiesMapHack/Particle"
import * as Treant from "./Module/TreantMapHack/Particle"
import * as VBS from "./Module/TrueSight/Entities"
import * as VBE from "./Module/VisibleByEnemy/Entities"
import * as Wisp from "./Module/WispMapHack/Particle"
// import * as TopHud from "./Module/TopHud/Entities"

// Something's wrong with reading file "panorama/images/spellicons/monkey_king_primal_spring_early_png.vtex_c"

let LocalPlayer = new ManagerBase

EventsSDK.on("Tick", () => {
	if (LocalPlayer.IsSpectator || !stateMain.value || Game.IsPaused)
		return false
	Treant.Tick()
})
EventsSDK.on("Draw", () => {
	if (LocalPlayer.IsSpectator || !stateMain.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return false
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
	if(LocalPlayer.IsSpectator)
		return false
	// TopHud.gameEnded()
	VBE.GameEnded()
	VBS.GameEnded()
	Camp.GameEnded()
	Wisp.GameEnded()
	Treant.GameEnded()
	Jungle.GameEnded()
	Techies.GameEnded()
	ParticleHack.GameEnded()
})

EventsSDK.on("GameConnected", () => {
	if (LocalPlayer.IsSpectator)
		return false
	ParticleHack.GameConnect()
})
