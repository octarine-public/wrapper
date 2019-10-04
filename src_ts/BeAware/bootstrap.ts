import { EventsSDK, Game, LocalPlayer } from "wrapper/Imports"
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
import * as TimeController from "./Module/TimeController/Renderer"
import * as TimeControllerEnt from "./Module/TimeController/Entities"

// import * as TopHud from "./Module/TopHud/Entities"

// Something's wrong with reading file "panorama/images/spellicons/monkey_king_primal_spring_early_png.vtex_c"

EventsSDK.on("Tick", () => {
	if (LocalPlayer === undefined) {
		return false
	}
	if (LocalPlayer.IsSpectator || !stateMain.value || Game.IsPaused) {
		return false
	}
	Treant.Tick()
})
EventsSDK.on("Draw", () => {
	if (LocalPlayer === undefined) {
		return false
	}
	if (LocalPlayer.IsSpectator || !stateMain.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME) {
		return false
	}
	Camp.OnDraw()
	Wisp.OnDraw()
	// TopHud.Draw()
	Roshan.Draw()
	Jungle.OnDraw()
	Techies.OnDraw()
	ParticleHack.OnDraw()
	TimeController.Draw()
})

EventsSDK.on("GameStarted", hero => {
	if (LocalPlayer === undefined) {
		return false
	}
	if (LocalPlayer.IsSpectator) {
		return false
	}
	// TopHud.gameStarted()
	Wisp.GameStarted()
	Jungle.GameStarted()
	Techies.GameStarted()
	ParticleHack.GameStarted()
	ParticleHack.GameStarted()
	TimeControllerEnt.GameStarted(hero)
})
EventsSDK.on("GameEnded", GameEnded_list)
EventsSDK.on("GameConnected", ParticleHack.GameConnect)
EventsSDK.on("EntityCreated", TimeControllerEnt.EntityCreated)
EventsSDK.on("EntityDestroyed", TimeControllerEnt.EntityDestroyed)
function GameEnded_list() {
	VBE.GameEnded()
	VBS.GameEnded()
	Camp.GameEnded()
	Wisp.GameEnded()
	Treant.GameEnded()
	Jungle.GameEnded()
	Techies.GameEnded()
	// TopHud.gameEnded()
	ParticleHack.GameEnded()
	TimeControllerEnt.GameEnded()
}