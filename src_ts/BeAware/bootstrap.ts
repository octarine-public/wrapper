import { EventsSDK, Game } from "wrapper/Imports"
import { stateMain } from "./abstract/Menu.Base"
import * as Roshan from "./Module/Roshan/Particle"
import * as Treant from "./Module/TreantMapHack/Particle"
import * as Wisp from "./Module/WispMapHack/Particle"

EventsSDK.on("Tick", () => {
	if (!stateMain.value || !Game.IsInGame || Game.IsPaused)
		return
	if (!Treant.Tick())
		return false
})
EventsSDK.on("Draw", () => {
	if (!stateMain.value || !Game.IsInGame)
		return
	Wisp.OnDraw()
	Roshan.Draw()
})
Events.on("ParticleCreated", (id, path, handle) => {
	if (!stateMain.value || !Game.IsInGame)
		return
	Roshan.Create(handle)
	Wisp.ParticleCreate(id, handle)
})

Events.on("ParticleUpdatedEnt", (id, cp, ent) => {
	if (!stateMain.value || !Game.IsInGame)
		return
	Wisp.ParticleUpdated(id, ent as C_DOTA_Unit_Hero_Wisp)
})
EventsSDK.on("GameStarted", () => {
})
EventsSDK.on("GameEnded", () => {
	Wisp.GameEnded()
	Treant.GameEnded()
})
