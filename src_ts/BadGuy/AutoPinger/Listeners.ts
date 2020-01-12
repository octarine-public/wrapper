import { Game, Hero, ArrayExtensions, PingType_t, Entity, Vector3, LocalPlayer, Color, RendererSDK, EntityManager, EventsSDK } from "wrapper/Imports"
import { Interval_val, State, HeroesList, DebugPing } from "./Menu"
let Sleep = 0
let Heroes: Hero[] = []
let Pos = new Vector3()

export function Tick() {
	if (!State.value || LocalPlayer!.Hero === undefined)
		return
	Heroes.some(x => {
		if (x.IsEnemy() || x === LocalPlayer!.Hero)
			return false
		let Timer = Game.RawGameTime
		if (!HeroPing(x)) {
			if (DebugPing.value)
				Pos = new Vector3()
			return false
		}
		if (Timer <= Sleep)
			return false
		if (DebugPing.value) {
			Pos = x.Position
			Game.ExecuteCommand("playvol ui/ping " + (1 / 200))
		}
		x.Position.toIOBuffer()
		Minimap.SendPing(PingType_t.NORMAL, false, x.Index)
		Sleep = Timer + (Interval_val.value / 100)
		return true
	})
}

export function Draw() {
	if (!State.value || !DebugPing.value || Pos.IsZero() || LocalPlayer?.IsSpectator)
		return
	RendererSDK.DrawMiniMapPing(Pos, Color.Green, Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration"))
}

function HeroPing(hero: Hero) {
	if (hero === undefined)
		return false
	return HeroesList.enabled_values.get(hero.Name)
}

export function UpdateMenu() {
	HeroesList.values = EntityManager.GetEntitiesByClass(Hero)
		.filter(x => x !== LocalPlayer?.Hero && !x.IsEnemy())
		.map(z => z.Name)
	HeroesList.Update()
}

export function EntityCreated(x: Entity) {
	if (x instanceof Hero) {
		UpdateMenu()
		Heroes.push(x)
	}
}
export function EntityDestroyed(x: Entity) {
	if (x instanceof Hero) {
		UpdateMenu()
		ArrayExtensions.arrayRemove(Heroes, x)
	}
}
EventsSDK.on("EntityNameChanged", x => {
	if (x instanceof Hero)
		UpdateMenu()
})

export function GameStarted() {
	// loop-optimizer: KEEP
	HeroesList.enabled_values.forEach((_, key) => HeroesList.enabled_values.set(key, false))
}
export function GameEnded() {
	Sleep = 0
	Pos = new Vector3()
	Heroes = []
	// loop-optimizer: KEEP
	HeroesList.enabled_values.forEach((_, key) => HeroesList.enabled_values.set(key, false))
	HeroesList.values = []
	HeroesList.Update()
}
