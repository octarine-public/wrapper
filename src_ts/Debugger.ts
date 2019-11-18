import { EventsSDK, Game, Menu, PlayerResource, ProjectileManager, RendererSDK, Vector2, Color } from "./wrapper/Imports"

let setConVar = (toggle: Menu.Toggle) =>
	ConVars.Set(toggle.tooltip, toggle.value)

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
	.OnRelease(self => Game.ExecuteCommand(self.tooltip))

sv_cheatsMenu.AddButton("Local lvl max")
	.SetTooltip("dota_hero_level 25")
	.OnValue(self => Game.ExecuteCommand(self.tooltip))

sv_cheatsMenu.AddButton("Get Rapier God")
	.SetTooltip("dota_rap_god")
	.OnValue(self => Game.ExecuteCommand(self.tooltip))

let addUnitMenu = debuggerMenu.AddNode("add unit")

addUnitMenu.AddKeybind("Add full Sven")
	.OnRelease(() => {
		Game.ExecuteCommand("dota_create_unit npc_dota_hero_sven enemy")

		setTimeout(() => {
			for (var i = 6; i--;)
				Game.ExecuteCommand("dota_bot_give_item item_heart")

			Game.ExecuteCommand("dota_bot_give_level 25")
		}, 1000)
	})

addUnitMenu.AddKeybind("Add creep")
	.SetTooltip("dota_create_unit npc_dota_creep_badguys_melee enemy")
	.OnRelease(self => Game.ExecuteCommand(self.tooltip))

EventsSDK.on("GameStarted", () => {
	ConVars.Set("sv_cheats", ConVars.GetInt("sv_cheats") || sv_cheats.value)
	ConVars.Set("dota_ability_debug", wtf.value)

	if (PlayerResource.AllPlayers.length <= 1)
		ConVars.Set("dota_all_vision", vision.value)

	ConVars.Set("dota_creeps_no_spawning", creepsNoSpawn.value)
})

const debugEventsMenu = debuggerMenu.AddNode("Debugging events", "Debugging native events in console")

const debugEvents = debugEventsMenu.AddToggle("Debugging events")

const debugDrawEvents = debugEventsMenu.AddToggle("Debug Draw")

const debugProjectiles = debugEventsMenu.AddToggle("Debug projectiles", false, "Visual only")

EventsSDK.on("Draw", () => {
	if (!debugEvents.value || !debugProjectiles.value || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	ProjectileManager.AllTrackingProjectiles.forEach(proj => {
		let w2s = RendererSDK.WorldToScreen(proj.Position)
		if (w2s === undefined)
			return
		RendererSDK.FilledRect(w2s.SubtractForThis(new Vector2(10, 10)), new Vector2(20, 20), new Color(255))
	})
	ProjectileManager.AllLinearProjectiles.forEach(proj => {
		let w2s = RendererSDK.WorldToScreen(proj.Position)
		if (w2s === undefined)
			return
		RendererSDK.FilledRect(w2s.SubtractForThis(new Vector2(10, 10)), new Vector2(20, 20), new Color(255))
	})
})

let old_emit = Events.emit,
	avg_map = new Map<string, [number, number]>(),
	max_map = new Map<string, number>()

function RegisterStats(name: string, took: number) {
	if (!avg_map.has(name)) {
		avg_map.set(name, [0, 0])
		max_map.set(name, 0)
	}
	let avg_ar = avg_map.get(name)
	avg_ar[0] *= avg_ar[1]
	avg_ar[0] += took
	avg_ar[1]++
	avg_ar[0] /= avg_ar[1]
	max_map.set(name, Math.max(max_map.get(name), took))
}

function ProfileEmit(name: string, cancellable?: boolean, ...args: any[]) {
	let t = Date.now()
	let ret = old_emit.apply(Events, [name, cancellable, ...args])
	t = Date.now() - t
	RegisterStats(name, t)
	return ret
}
Events.emit = ProfileEmit

global.dump_stats = () => {
	console.log("Average: ")
	for (let [name, [took]] of avg_map.entries())
		console.log(`${name}: ${took}ms`)

	console.log("-".repeat(10))

	console.log("Max: ")
	for (let [name, took] of max_map.entries())
		console.log(`${name}: ${took}ms`)
}
