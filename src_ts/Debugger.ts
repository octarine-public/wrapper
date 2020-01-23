import { EventsSDK, GameState, Menu, PlayerResource, ProjectileManager, RendererSDK, Vector2, Color, DOTAGameUIState_t, EventEmitter, Events } from "./wrapper/Imports"

declare global {
	var dump_stats: Function
	var dump_stats_listeners: Function
	var SafeLog: Function
	var reset_avg_mult: Function
	var dump_total: Function
}

let setConVar = (self: Menu.Toggle) => ConVars.Set(self.tooltip!, self.value)
let exec = (self: Menu.Base) => GameState.ExecuteCommand(self.tooltip!)

let debuggerMenu = Menu.AddEntry("Debugger")

let sv_cheatsMenu = debuggerMenu.AddNode("Concommands")
debuggerMenu.AddKeybind("Snapshot").OnRelease(() => {
	TakeHeapSnapshot("dumps/manual_heap_" + Math.random().toString().substring(2, 8) + ".heapsnapshot")
})
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

const debugEventsMenu = debuggerMenu.AddNode("Debugging events", "Debugging native events in console")

const debugEvents = debugEventsMenu.AddToggle("Debugging events")

const debugProjectiles = debugEventsMenu.AddToggle("Debug projectiles", false, "Visual only")

function SafeLog(...args: any[]) {
	// loop-optimizer: KEEP
	console.log(...args.map(arg => JSON.parse(JSON.stringify(arg, (key, value) => typeof value === 'bigint' ? value.toString() + 'n' : value))))
}
globalThis.SafeLog = SafeLog

EventsSDK.on("GameEvent", (name, obj) => {
	if (!debugEvents.value)
		return
	SafeLog(name, obj)
})
EventsSDK.on("ServerInfo", obj => {
	if (!debugEvents.value)
		return
	SafeLog(obj) // TODO: that's map, and maps doesn't have serialization
})

// let config = (Utils.parseKVFile("resource/ui/hud_base.res").get("Resource/UI/HUD_Base.res") as Parse.RecursiveMap).get("MiniMap") as Parse.RecursiveMap
EventsSDK.on("Draw", () => {
	/*let size = parseInt(config.get("tall") as string)
	let vec_size = RendererSDK.GetProportionalScaledVector(new Vector2(size, size), true, 1.15)
	RendererSDK.Line(new Vector2(0, RendererSDK.WindowSize.y - vec_size.y), new Vector2(vec_size.x, 0))*/
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

let avg_map_events = new Map<string, [number, number]>(),
	counter_map_events = new Map<string, number[]>(),
	max_map_events = new Map<string, number>(),
	avg_map_listeners = new Map<string, Map<string, [number, number]>>(),
	max_map_listeners = new Map<string, Map<string, number>>()

function RegisterStatsEvent(name: string, took: number): void {
	if (!avg_map_events.has(name)) {
		avg_map_events.set(name, [0, 0])
		max_map_events.set(name, 0)
		counter_map_events.set(name, [])
	}
	let avg_ar = avg_map_events.get(name)!
	avg_ar[0] *= avg_ar[1]
	avg_ar[0] += took
	avg_ar[1]++
	avg_ar[0] /= avg_ar[1]
	max_map_events.set(name, Math.max(max_map_events.get(name)!, took))
	counter_map_events.get(name)!.push(hrtime())
}

function RegisterStatsListener(event_name: string, name: string, took: number) {
	if (!avg_map_listeners.has(event_name)) {
		avg_map_listeners.set(event_name, new Map())
		max_map_listeners.set(event_name, new Map())
	}
	let avg_map = avg_map_listeners.get(event_name)!,
		max_map = max_map_listeners.get(event_name)!
	if (!avg_map.has(name)) {
		avg_map.set(name, [0, 0])
		max_map.set(name, 0)
	}
	let avg_ar = avg_map.get(name)!
	avg_ar[0] *= avg_ar[1]
	avg_ar[0] += took
	avg_ar[1]++
	avg_ar[0] /= avg_ar[1]
	max_map.set(name, Math.max(max_map.get(name)!, took))
}

class ProfilingEventEmitter extends EventEmitter {
	public emit(name: string, cancellable: boolean, ...args: any[]) {
		let start_time = hrtime()
		let listeners = this.events.get(name),
			listeners_after = this.events_after.get(name)

		let ret = listeners === undefined || !listeners.some(listener => {
			try {
				let t = hrtime()
				let ret = listener.apply(this, args)
				RegisterStatsListener(name, this.listener2line.get(listener)!, hrtime() - t)
				return ret === false && cancellable
			} catch (e) {
				console.log(e.stack || new Error(e).stack)
				return false
			}
		})
		if (listeners_after !== undefined && ret)
			listeners_after.forEach(listener => {
				try {
					let t = hrtime()
					listener.apply(this, args)
					RegisterStatsListener(name, this.listener2line.get(listener)!, hrtime() - t)
				} catch (e) {
					console.log(e.stack || new Error(e).stack)
				}
			})
		RegisterStatsEvent(name, hrtime() - start_time)
		return ret
	}
}
Events.emit = ProfilingEventEmitter.prototype.emit

EventsSDK.on("Draw", () => {
	// loop-optimizer: KEEP
	counter_map_events.forEach((ar, name) => {
		let cur_date = hrtime()
		// loop-optimizer: FORWARD
		counter_map_events.set(name, ar.filter(date => cur_date - date < 30 * 1000))
	})
})

globalThis.dump_stats = () => {
	console.log("Average: ")
	for (let [name, [took]] of avg_map_events.entries())
		console.log(`${name}: ${took}ms`)

	console.log("-".repeat(10))

	console.log("Calls per second for last 30 seconds: ")
	for (let [name, ar] of counter_map_events.entries())
		console.log(`${name}: ${ar.length / 30}`)

	console.log("-".repeat(10))

	console.log("Max: ")
	for (let [name, took] of max_map_events.entries())
		console.log(`${name}: ${took}ms`)
}
globalThis.dump_total = () => {
	let total = 0
	console.log("Average: ")
	for (let [name, [took]] of avg_map_events.entries())
		for (let [name2, ar] of counter_map_events.entries())
			if (name === name2) {
				total += took * ar.length / 30
				break
			}

	console.log(total)
}

function filter_avg(map: Map<string, Map<string, [number, number]>>) {
	let filtered: [string, [string, number][]][] = []
	for (let [event_name, map_] of map.entries()) {
		let ar: [string, number][] = []
		for (let [listener_name, times] of map_.entries())
			ar.push([listener_name, times[0] / times[1]])
		filtered.push([event_name, ar.sort((a, b) => b[1] - a[1])])
	}
	return filtered.sort((a, b) => b[1].reduce((c, d) => c + d[1], 0) - a[1].reduce((c, d) => c + d[1], 0))
}
function filter_max(map: Map<string, Map<string, number>>) {
	let filtered: [string, [string, number][]][] = []
	for (let [event_name, map_] of map.entries()) {
		filtered.push([event_name, [...map_.entries()].sort((a, b) => b[1] - a[1])])
	}
	return filtered.sort((a, b) => b[1].reduce((c, d) => c + d[1], 0) - a[1].reduce((c, d) => c + d[1], 0))
}

globalThis.dump_stats_listeners = () => {
	console.log("Average: ")
	let avg = filter_avg(avg_map_listeners)
	for (let i = 0; i < Math.min(5, avg.length); i++) {
		let [event_name, ar] = avg[i]
		console.log(event_name + ": ")
		// loop-optimizer: FORWARD
		ar.forEach(([name, took]) => console.log(`${name}: ${took}ms`))
	}
	console.log("-".repeat(10))

	console.log("Max: ")
	let max = filter_max(max_map_listeners)
	for (let i = 0; i < Math.min(5, max.length); i++) {
		let [event_name, ar] = max[i]
		console.log(event_name + ": ")
		// loop-optimizer: FORWARD
		ar.forEach(([name, took]) => console.log(`${name}: ${took}ms`))
	}
}

globalThis.reset_avg_mult = () => {
	for (let [, map] of avg_map_listeners.entries())
		for (let [, ar] of map.entries())
			ar[1] = 1
	for (let [, ar] of avg_map_events.entries())
		ar[1] = 1
}

let last_time = 0
EventsSDK.on("Draw", () => {
	if (hrtime() - last_time < 10000 || GetHeapStatistics().total_heap_size < 300n * 1024n * 1024n)
		return
	TakeHeapSnapshot("dumps/" + Math.random().toString().substring(2, 8) + ".heapsnapshot")
	last_time = hrtime()
})
