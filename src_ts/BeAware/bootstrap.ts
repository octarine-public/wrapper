import { 
	EventsSDK, 
	Game, 
	LocalPlayer, 
	Entity 
} from "wrapper/Imports"

import { stateMain } from "./abstract/Menu.Base"

import * as JungMapHack from "./Module/JungleMapHack/Particle"
import * as ParicleMapHack from "./Module/ParticleMapHack/Particle"
import * as Camp from "./Module/CampInformer/Entity"
import * as Jungle from "./Module/JungleMapHack/Particle"
import * as ParticleHack from "./Module/ParticleMapHack/Particle"
import * as Techies from "./Module/TechiesMapHack/Particle"
import * as Treant from "./Module/TreantMapHack/Particle"
import * as VBS from "./Module/TrueSight/Entities"
import * as VBE from "./Module/VisibleByEnemy/Entities"
import * as Wisp from "./Module/WispMapHack/Particle"
import * as TowerRange from "./Module/TowerRange/Particle"
import * as TimeController from "./Module/TimeController/Renderer"
import * as TimeControllerEnt from "./Module/TimeController/Entities"
import * as EnemyLaneSelection from "./Module/EnemyLaneSelection/Listeners"

// import * as TopHud from "../Module/TopHud/Entities"
// import * as TopHud from "./Module/TopHud/Entities"
// Something's wrong with reading file "panorama/images/spellicons/monkey_king_primal_spring_early_png.vtex_c"

EventsSDK.on("Tick", () => {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || !stateMain.value || Game.IsPaused) {
		return false
	}
	Treant.Tick()
	TimeControllerEnt.Tick()
})

EventsSDK.on("Draw", () => {
	if (!stateMain.value || LocalPlayer === undefined || LocalPlayer.IsSpectator || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	EnemyLaneSelection.Draw()
	if (!Game.IsInGame)
		return
	Camp.OnDraw()
	Wisp.OnDraw()
	// TopHud.Draw()
	Jungle.OnDraw()
	Techies.OnDraw()
	TowerRange.OnDraw()
	TimeController.Draw()
	ParticleHack.OnDraw()
})

EventsSDK.on("GameStarted", hero => {
	// TopHud.gameStarted()
	Wisp.GameStarted()
	Jungle.GameStarted()
	Techies.GameStarted()
	ParticleHack.GameStarted()
	ParticleHack.GameStarted()
	EnemyLaneSelection.GameStarted()
	TimeControllerEnt.GameStarted(hero)
})

EventsSDK.on("GameEnded", () => {
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
	EnemyLaneSelection.GameEnded()
})

EventsSDK.on("GameConnected", () => {
	ParticleHack.GameConnect() 
	EnemyLaneSelection.GameConnect()
})

EventsSDK.on("UnitAnimation", npc => {
	if (!stateMain.value || npc === undefined)
		return
	JungMapHack.UnitAnimationCreate(npc)
	TimeControllerEnt.UnitAnimationCreate(npc)
})

EventsSDK.on("LifeStateChanged", ent => {
	if (!stateMain.value)
		return
	Techies.LifeStateChanged(ent)
	VBE.LifeStateChanged(ent)
	VBS.LifeStateChanged(ent)
})

EventsSDK.on("ParticleDestroyed", id => {
	Techies.ParticleDestroyed(id)
	ParicleMapHack.ParticleDestroyed(id)
	TimeControllerEnt.ParticleDestroyed(id)
})

EventsSDK.on("TrueSightedChanged", npc => {
	VBS.TrueSightedChanged(npc)
})

EventsSDK.on("TeamVisibilityChanged", npc => {
	if (!stateMain.value || Game.IsPaused)
		return
	VBE.TeamVisibilityChanged(npc)
})

EventsSDK.on("EntityCreated", (ent, index) => {
	Camp.onEntityAdded(ent)
	Treant.Create(ent, index)
	TowerRange.Create(ent)
	ParicleMapHack.EntityCreated(ent)
	TimeControllerEnt.EntityCreated(ent)
	// TopHud.entityCreate(ent)
})

EventsSDK.on("EntityDestroyed", (ent, index) => {
	VBS.EntityDestroyed(ent)
	VBE.EntityDestroyed(ent)
	Camp.EntityDestroyed(ent)
	Treant.Destroy(ent, index)
	TowerRange.Destroy(ent)
	// TopHud.entityDestroy(ent)
	Techies.EntityDestroyed(ent)
	ParicleMapHack.EntityDestroyed(ent)
	TimeControllerEnt.EntityDestroyed(ent)
})

EventsSDK.on("ParticleUpdated", (id, control_point, position) => {
	if (!stateMain.value)
		return
	Techies.ParticleUpdated(id, control_point, position)
	ParicleMapHack.ParticleCreateUpdate(id, control_point, position)
})

EventsSDK.on("ParticleCreated", (id, path, handle, attach, entity) => {
	if (stateMain.value) {
		Wisp.ParticleCreate(id, handle)
		Techies.ParticleCreated(id, entity instanceof Entity ? entity : undefined, path)
		ParicleMapHack.ParticleCreate(id, handle, path, entity instanceof Entity ? entity : undefined)
		TimeControllerEnt.ParticleCreated(id, entity instanceof Entity ? entity : undefined, path, handle)
	}
})

EventsSDK.on("ParticleUpdatedEnt", (id, control_point, entity, attach, attachment, vector) => {
	if (!stateMain.value)
		return
	Techies.ParticleUpdatedEnt(id, control_point, attach, vector)
	Wisp.ParticleUpdated(id, entity instanceof Entity ? entity.m_pBaseEntity : undefined)
	ParicleMapHack.ParticleUpdatedEnt(id, entity instanceof Entity ? entity : undefined, vector)
	TimeControllerEnt.ParticleUpdateEnt(id, entity instanceof Entity ? entity : undefined, vector)
})