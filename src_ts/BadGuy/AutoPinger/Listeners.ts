import { Game, Hero, ArrayExtensions, PingType_t, Entity } from "wrapper/Imports"
import { Interval_val, State, HeroesList, DebugPing } from "./Menu"
let Sleep = 0
let Heroes: Hero[] = []
let Pos = new Vector3

export function Tick() {
	if (!State.value || LocalPlayer!.Hero === undefined)
		return
	Heroes.some(x => {
		if (x.IsEnemy() || x.Index === LocalPlayer?.Hero?.Index)
			return false
		let Timer = Game.RawGameTime
		if (!HeroPing(x)) {
			if (DebugPing.value)
				Pos = new Vector3
			return false
		}
		if (Timer <= Sleep)
			return false
		if (DebugPing.value) {
			Pos = x.Position
			Game.ExecuteCommand("playvol ui/ping " + (1 / 200))
		}
		x.Position.toIOBuffer()
		Minimap.SendPing(PingType_t.NORMAL, false, x.m_pBaseEntity)
		Sleep = Timer + (Interval_val.value / 100)
		return true
	})
}

export function Draw() {
	if (!State.value || !DebugPing.value || Pos.IsZero() || LocalPlayer?.IsSpectator)
		return
	RendererSDK.DrawMiniMapIcon("minimap_ping", Pos, 1200, Color.Green)
}

function HeroPing(hero: Hero) {
	if (hero === undefined)
		return false
	return HeroesList.enabled_values.get(hero.Name)
}

export function UpdateMenu() {
	HeroesList.values = EntityManager.GetEntitiesByClass(Hero)
		.filter(x => x.Index !== LocalPlayer?.Hero?.Index && !x.IsEnemy())
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

export function GameStarted() {
	// loop-optimizer: KEEP
	HeroesList.enabled_values.forEach((_, key) => HeroesList.enabled_values.set(key, false))
}
export function GameEnded() {
	Sleep = 0
	Pos = new Vector3
	Heroes = []
	// loop-optimizer: KEEP
	HeroesList.enabled_values.forEach((_, key) => HeroesList.enabled_values.set(key, false))
	HeroesList.values = []
	HeroesList.Update()
}