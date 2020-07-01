import { EventsSDK, GameState, Menu, PlayerResource, ProjectileManager, RendererSDK, Vector2, Color, DOTAGameUIState_t } from "./wrapper/Imports"
import { MapToObject } from "./wrapper/Utils/Utils"

let setConVar = (self: Menu.Toggle) => ConVars.Set(self.tooltip!, self.value)
let exec = (self: Menu.Base) => GameState.ExecuteCommand(self.tooltip!)

let debuggerMenu = Menu.AddEntry("Debugger")

let sv_cheatsMenu = debuggerMenu.AddNode("Concommands")
let sv_cheats = sv_cheatsMenu.AddToggle("sv_cheats")
	.SetTooltip("sv_cheats")
	.OnValue(setConVar)

let wtf = sv_cheatsMenu.AddToggle("wtf")
	.SetTooltip("dota_ability_debug")
	.OnValue(setConVar)

let vision = sv_cheatsMenu.AddToggle("all vision")
	.SetTooltip("dota_all_vision")
	.OnValue(setConVar)

let creepsNoSpawn = sv_cheatsMenu.AddToggle("Creeps no spawning")
	.SetTooltip("dota_creeps_no_spawning")
	.OnValue(setConVar)

sv_cheatsMenu.AddKeybind("Refresh")
	.SetTooltip("dota_hero_refresh")
	.OnRelease(exec)

sv_cheatsMenu.AddButton("Local lvl max")
	.SetTooltip("dota_hero_level 25")
	.OnValue(exec)

sv_cheatsMenu.AddButton("Get Rapier God")
	.SetTooltip("dota_rap_god")
	.OnValue(exec)

let addUnitMenu = debuggerMenu.AddNode("add unit")

/*addUnitMenu.AddKeybind("Add full Sven")
	.OnRelease(() => {
		Game.ExecuteCommand("dota_create_unit npc_dota_hero_sven enemy")

		setTimeout(() => {
			for (var i = 6; i--;)
				Game.ExecuteCommand("dota_bot_give_item item_heart")

			Game.ExecuteCommand("dota_bot_give_level 30")
		}, 1000)
	})*/

addUnitMenu.AddKeybind("Add creep")
	.SetTooltip("dota_create_unit npc_dota_creep_badguys_melee enemy")
	.OnRelease(exec)

EventsSDK.on("GameStarted", () => {
	ConVars.Set("sv_cheats", ConVars.GetInt("sv_cheats") || sv_cheats.value)
	ConVars.Set("dota_ability_debug", wtf.value)

	if ((PlayerResource?.AllPlayers?.length ?? 0) <= 1)
		ConVars.Set("dota_all_vision", vision.value)

	ConVars.Set("dota_creeps_no_spawning", creepsNoSpawn.value)
})

const debugEventsMenu = debuggerMenu.AddNode("Debugging events", undefined, "Debugging native events in console")

const debugEvents = debugEventsMenu.AddToggle("Debugging events")

const debugProjectiles = debugEventsMenu.AddToggle("Debug projectiles", false, "Visual only")

function SafeLog(...args: any[]) {
	console.log(...args.map(arg => JSON.parse(JSON.stringify(arg, (key, value) => typeof value === 'bigint' ? value.toString() + 'n' : value))))
}

EventsSDK.on("GameEvent", (name, obj) => {
	if (!debugEvents.value)
		return
	SafeLog(name, obj)
})
EventsSDK.on("ServerInfo", obj => {
	if (!debugEvents.value)
		return
	SafeLog(MapToObject(obj))
})

// let config = (Utils.parseKVFile("resource/ui/hud_base.res").get("Resource/UI/HUD_Base.res") as Parse.RecursiveMap).get("MiniMap") as Parse.RecursiveMap
EventsSDK.on("Draw", () => {
	/*let size = parseInt(config.get("tall") as string)
	let vec_size = RendererSDK.GetProportionalScaledVector(new Vector2(size, size), true, 1.15)
	let start = new Vector2(0, RendererSDK.WindowSize.y - vec_size.y)
	RendererSDK.Line(start, start.Add(new Vector2(vec_size.x, 0)))*/
	if (!debugEvents.value || !debugProjectiles.value || GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	ProjectileManager.AllTrackingProjectiles.forEach(proj => {
		let w2s = RendererSDK.WorldToScreen(proj.Position)
		if (w2s === undefined)
			return
		RendererSDK.FilledRect(w2s.SubtractForThis(new Vector2(10, 10)), new Vector2(20, 20), new Color(0, 255))
	})
	ProjectileManager.AllLinearProjectiles.forEach(proj => {
		let w2s = RendererSDK.WorldToScreen(proj.Position)
		if (w2s === undefined)
			return
		RendererSDK.FilledRect(w2s.SubtractForThis(new Vector2(10, 10)), new Vector2(20, 20), new Color(255))
	})
})
