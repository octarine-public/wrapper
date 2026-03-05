// import {
// 	EntityManager,
// 	EventsSDK,
// 	Flow,
// 	GameState,
// 	Hero,
// 	lina_light_strike_array,
// 	LocalPlayer,
// 	Menu
// } from "../wrapper/Imports"

// const menu = Menu.AddEntry("TEST")
// const key = menu.AddKeybind("KEY")

// let pending = false
// let castTime = 0
// let castServerTick = 0

// key.OnRelease(() => {
// 	pending = true
// })

// EventsSDK.on("GameEvent", (name, obj) => {
// 	if (name !== "entity_hurt") {
// 		return
// 	}
// 	const hero = LocalPlayer?.Hero
// 	if (hero === undefined) {
// 		return
// 	}
// 	const attacker = EntityManager.EntityByIndex(obj.entindex_attacker)
// 	if (attacker !== hero) {
// 		return
// 	}
// 	const hitServerTick = obj.server_tick ?? 0
// 	const elapsed = GameState.RawGameTime - castTime
// 	console.log("--- Hit Event ---")
// 	console.log(`  GameTime: ${GameState.RawGameTime}`)
// 	console.log(`  Elapsed since cast: ${elapsed}`)
// 	console.log(`  ServerTick delta: ${GameState.CurrentServerTick - castServerTick}`)
// 	console.log(`  ServerTick delta (event): ${hitServerTick - castServerTick}`)
// })

// EventsSDK.on("PostDataUpdate", dt => {
// 	if (dt === 0 || !pending) {
// 		return
// 	}
// 	const hero = LocalPlayer?.Hero
// 	const target = EntityManager.GetEntitiesByClass(Hero).find(
// 		x => x !== hero && x.IsEnemy()
// 	)
// 	if (hero === undefined || target === undefined) {
// 		return
// 	}

// 	const lsa = hero.GetAbilityByClass(lina_light_strike_array)
// 	if (lsa === undefined || !lsa.CanBeCasted()) {
// 		return
// 	}

// 	pending = false
// 	const hitTime = lsa.GetHitTime(target)
// 	const castDelay = lsa.GetCastDelay(target)
// 	const castPoint = lsa.CastPoint
// 	const activationDelay = lsa.ActivationDelay
// 	const turnTime = hero.TurnTimeNew(target.Position, false, false, true)
// 	const inputLag = GameState.InputLag
// 	const ioLag = GameState.GetIOLag(GameState.GetLatency())

// 	castTime = GameState.RawGameTime
// 	castServerTick = GameState.CurrentServerTick

// 	console.log("=== LSA Cast ===")
// 	console.log(`  GameTime: ${castTime}`)
// 	console.log(`  ServerTick: ${castServerTick}`)
// 	console.log(`  GetHitTime: ${hitTime}`)
// 	console.log(`  CastDelay: ${castDelay}`)
// 	console.log(`  CastPoint: ${castPoint}`)
// 	console.log(`  ActivationDelay: ${activationDelay}`)
// 	console.log(`  TurnTime: ${turnTime}`)
// 	console.log(`  InputLag: ${inputLag}`)
// 	console.log(`  GetIOLag: ${ioLag}`)
// 	console.log(`  Latency OUT: ${GameState.GetLatency(Flow.OUT)}`)
// 	console.log(`  IsDedicatedServer: ${GameState.IsDedicatedServer}`)
// 	console.log(`  Expected hit at: ${castTime + hitTime}`)

// 	hero.CastPosition(lsa, target.Position, false, true)
// })
