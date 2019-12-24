import { EventsSDK, Game, Menu, PlayerResource, ProjectileManager, RendererSDK, Vector2, Color, Events, DOTAGameUIState_t } from "./wrapper/Imports"

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

			Game.ExecuteCommand("dota_bot_give_level 30")
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

const debugProjectiles = debugEventsMenu.AddToggle("Debug projectiles", false, "Visual only")

function SafeLog(...args) {
	// loop-optimizer: KEEP
	console.log(...args.map(arg => JSON.parse(JSON.stringify(arg, (key, value) => typeof value === 'bigint' ? value.toString() + 'n' : value))))
}

EventsSDK.on("GameEvent", (name, obj) => {
	if (!debugEvents.value)
		return
	SafeLog(name, obj)
})
Events.on("ServerInfo", obj => {
	if (!debugEvents.value)
		return
	SafeLog(obj)
})

// let config = (Utils.parseKVFile("resource/ui/hud_base.res").get("Resource/UI/HUD_Base.res") as Parse.RecursiveMap).get("MiniMap") as Parse.RecursiveMap
EventsSDK.on("Draw", () => {
	/*let size = parseInt(config.get("tall") as string)
	let vec_size = Utils.GetProportionalScaledVector(new Vector2(size, size), true, 1.15)
	RendererSDK.Line(new Vector2(0, RendererSDK.WindowSize.y - vec_size.y), new Vector2(vec_size.x, 0))*/
	if (!debugEvents.value || !debugProjectiles.value || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
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

{
	let old_emit = Events.emit,
		avg_map = new Map<string, [number, number]>(),
		frame_avg_map = new Map<string, [number, number]>(),
		frame_buffer_map = new Map<string, number>(),
		counter_map = new Map<string, number[]>(),
		max_map = new Map<string, number>()

	function RegisterStats(name: string, took: number) {
		if (!avg_map.has(name)) {
			avg_map.set(name, [0, 0])
			max_map.set(name, 0)
			frame_avg_map.set(name, [0, 0])
			frame_buffer_map.set(name, 0)
			counter_map.set(name, [])
		}
		let avg_ar = avg_map.get(name)
		avg_ar[0] *= avg_ar[1]
		avg_ar[0] += took
		avg_ar[1]++
		avg_ar[0] /= avg_ar[1]
		max_map.set(name, Math.max(max_map.get(name), took))
		frame_buffer_map.set(name, frame_buffer_map.get(name) + took)
		counter_map.get(name).push(Date.now())
	}

	setInterval(() => {
		// loop-optimizer: KEEP
		counter_map.forEach((ar, name) => {
			let cur_date = Date.now()
			// loop-optimizer: FORWARD
			counter_map.set(name, ar.filter(date => cur_date - date < 30 * 1000))
		})
	}, 10)

	function ProfileEmit(name: string, cancellable?: boolean, ...args: any[]) {
		let t = Date.now()
		let ret = old_emit.apply(Events, [name, cancellable, ...args])
		t = Date.now() - t
		RegisterStats(name, t)
		if (name === "Draw") {
			// loop-optimizer: KEEP
			frame_buffer_map.forEach((took, name_) => {
				let avg_ar = frame_avg_map.get(name_)
				avg_ar[0] *= avg_ar[1]
				avg_ar[0] += took
				avg_ar[1]++
				avg_ar[0] /= avg_ar[1]
				frame_buffer_map.set(name_, 0)
			})
		}

		return ret
	}
	Events.emit = ProfileEmit

	globalThis.dump_stats = () => {
		console.log("Average: ")
		for (let [name, [took]] of avg_map.entries())
			console.log(`${name}: ${took}ms`)

		console.log("-".repeat(10))

		console.log("Average per frame: ")
		for (let [name, [took]] of frame_avg_map.entries())
			console.log(`${name}: ${took}ms`)

		console.log("-".repeat(10))

		console.log("Calls per second for last 30 seconds: ")
		for (let [name, ar] of counter_map.entries())
			console.log(`${name}: ${ar.length / 30}`)

		console.log("-".repeat(10))

		console.log("Max: ")
		for (let [name, took] of max_map.entries())
			console.log(`${name}: ${took}ms`)
	}
}

{
	let old_emit = EventsSDK.emit,
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

	function ProfileEmit(name: string, cancellable: boolean, ...args: any) {
		if (name !== "Tick")
			return old_emit.apply(EventsSDK, [name, cancellable, ...args])
		let listeners = this.events.get(name)

		let ret = listeners === undefined || !listeners.some(listener => {
			let t = Date.now()
			try {
				let ret = listener.apply(this, args)
				t = Date.now() - t
				RegisterStats(this.listener2line.get(listener), t)
				return ret === false && cancellable
			} catch (e) {
				console.log(e.stack || new Error(e).stack)
				return false
			}
		})
		return ret
	}
	EventsSDK.emit = ProfileEmit

	globalThis.dump_stats_tick = () => {
		console.log("Average: ")
		for (let [name, [took]] of avg_map.entries())
			console.log(`${name}: ${took}ms`)

		console.log("-".repeat(10))

		console.log("Max: ")
		for (let [name, took] of max_map.entries())
			console.log(`${name}: ${took}ms`)
	}
}
