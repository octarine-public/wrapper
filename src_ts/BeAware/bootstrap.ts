import { EventsSDK, Game,Hero,ArrayExtensions, LocalPlayer, Unit, Entity, Vector3 } from "wrapper/Imports"
import { stateMain } from "./abstract/Menu.Base"
import * as Roshan from "./Module/Roshan/Particle"
import * as Camp from "./Module/CampInformer/Entity"
import * as Wisp from "./Module/WispMapHack/Particle"
import * as Treant from "./Module/TreantMapHack/Particle"
import * as Jungle from "./Module/JungleMapHack/Particle"
import * as Techies from "./Module/TechiesMapHack/Particle"
import * as ParticleHack from "./Module/ParticleMapHack/Particle"
// import * as TopHud from "./Module/TopHud/Entities"

EventsSDK.on("Tick", () => {
	if (!stateMain.value || Game.IsPaused)
		return
	if (!Treant.Tick())
		return false
})
EventsSDK.on("Draw", () => {
	if (!stateMain.value || !Game.IsInGame || Game.IsPaused)
		return
	Camp.OnDraw()
	Wisp.OnDraw()
	//TopHud.Draw()
	Roshan.Draw()
	Jungle.OnDraw()
	Techies.OnDraw()
	ParticleHack.OnDraw()
})

EventsSDK.on("GameStarted", () => {
	//TopHud.gameStarted()
})
EventsSDK.on("GameEnded", () => {
	//TopHud.gameEnded()
	Camp.GameEnded()
	Wisp.GameEnded()
	Treant.GameEnded()
	Jungle.GameEnded()
	Techies.GameEnded()
	ParticleHack.GameEnded()
})