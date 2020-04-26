import { Entity, EventsSDK, GameState, LocalPlayer, DOTAGameUIState_t, GameRules } from "wrapper/Imports"
import { stateMain } from "./abstract/Menu.Base"

import * as Camp from "./Module/CampInformer/Entity"
import * as VBS from "./Module/TrueSight/Entities"
import * as VBE from "./Module/VisibleByEnemy/Entities"
import * as Wisp from "./Module/WispMapHack/Particle"
import * as Treant from "./Module/TreantMapHack/Particle"
import * as Techies from "./Module/TechiesMapHack/Particle"
import * as JungleMapHack from "./Module/JungleMapHack/Particle"
import * as ParicleMapHack from "./Module/ParticleMapHack/Particle"
EventsSDK.on("Tick", () => {
	if (LocalPlayer!.IsSpectator || !stateMain.value)
		return
	Camp.Tick()
	Treant.Tick()
	JungleMapHack.Tick()
})

EventsSDK.on("Draw", () => {
	if (!stateMain.value || LocalPlayer?.IsSpectator || GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	if (!GameRules?.IsInGame)
		return
	Camp.OnDraw()
	Wisp.OnDraw()
	// TopHud.Draw()
	Techies.OnDraw()
	JungleMapHack.OnDraw()
	ParicleMapHack.OnDraw()
})

EventsSDK.on("GameEnded", () => {
	VBE.Init()
	VBS.Init()
	Wisp.Init()
	Treant.Init()
	Techies.Init()
	JungleMapHack.Init()
	ParicleMapHack.Init()
})

EventsSDK.on("GameStarted", () => {
	VBE.Init()
	VBS.Init()
	Wisp.Init()
	Treant.Init()
	Techies.Init()
	JungleMapHack.Init()
	ParicleMapHack.Init()
})

EventsSDK.on("GameEvent", (name, obj) => {
	JungleMapHack.GameEvent(name, obj)
})

EventsSDK.on("LifeStateChanged", ent => {
	if (!stateMain.value)
		return
	Techies.LifeStateChanged(ent)
	VBE.LifeStateChanged(ent)
	VBS.LifeStateChanged(ent)
})

EventsSDK.on("TrueSightedChanged", npc => {
	VBS.TrueSightedChanged(npc)
})

EventsSDK.on("TeamVisibilityChanged", npc => {
	if (!stateMain.value || GameRules?.IsPaused)
		return
	VBE.TeamVisibilityChanged(npc)
})

EventsSDK.on("EntityCreated", ent => {
	Treant.Create(ent)
})

EventsSDK.on("EntityDestroyed", ent => {
	VBS.EntityDestroyed(ent)
	VBE.EntityDestroyed(ent)
	Treant.Destroy(ent)
	Techies.EntityDestroyed(ent)
})

EventsSDK.on("ParticleUpdated", (id, control_point, position) => {
	if (!stateMain.value)
		return
	Techies.ParticleUpdated(id, control_point, position)
	ParicleMapHack.ParticleCreateUpdate(id, control_point, position)
})

EventsSDK.on("ParticleCreated", (id, path, handle, attach, entity) => {
	if (!stateMain.value)
		return
	let ent = entity instanceof Entity ? entity : undefined
	Wisp.ParticleCreate(id, handle)
	Techies.ParticleCreated(id, ent, path)
	ParicleMapHack.ParticleCreate(id, handle, path, ent)
})

EventsSDK.on("ParticleUpdatedEnt", (id, control_point, entity, attach, attachment, vector) => {
	if (!stateMain.value)
		return
	Techies.ParticleUpdatedEnt(id, control_point, attach, vector)
	let ent = entity instanceof Entity ? entity : undefined
	Wisp.ParticleUpdated(id, ent, vector)
	ParicleMapHack.ParticleUpdatedEnt(id, ent, vector)
})

EventsSDK.on("ParticleDestroyed", id => {
	Techies.ParticleDestroyed(id)
	ParicleMapHack.ParticleDestroyed(id)
})
