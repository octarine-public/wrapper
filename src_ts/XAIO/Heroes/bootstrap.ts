import {
	Game,
	Unit,
	Input,
	EventsSDK,
	LocalPlayer,
	ArrayExtensions,
	DOTAGameUIState_t
} from "wrapper/Imports"

import XAIOParticle from "../Core/Draw"
import { Units, UnitsIsControllable, XAIOStateGlobal } from "../bootstrap"

export const XAIOParticleMap = new Map<Unit, XAIOParticle>()

// import { OrderSkywrathMage } from "../Heroes/SkywrathMage/Listeners"


export function orderByFromUnit(range: number = 1200, unit?: Nullable<Unit>) {
	let input = unit === undefined ? Input.CursorOnWorld : unit
	return ArrayExtensions.orderBy(Units.filter(x =>
		x.IsEnemy() && !x.IsIllusion && !x.IsInvulnerable
		&& x.IsAlive && x.IsHero && x.Distance(input) <= range), x => x.Distance2D(input))[0]
}

interface HeroModule {
	InitTick(unit: Unit): void
	InitDraw(unit: Unit): void
}

let hero_modules = new Map<string, HeroModule>()

export let oldUnits: Unit[] = []

export function RegisterHeroModule(name: string, module: HeroModule) {
	hero_modules.set(name, module)
}

let ValidPlayerStateGame = () => LocalPlayer === undefined
	|| LocalPlayer!.IsSpectator || !Game.IsInGame

EventsSDK.on("Tick", () => {
	if (ValidPlayerStateGame() || !XAIOStateGlobal.value)
		return

	UnitsIsControllable.some(unit =>
		!unit.IsEnemy()
		&& hero_modules.get(unit.Name)?.InitTick(unit)
	)
})

EventsSDK.on("Tick", () => {
	UnitsIsControllable.forEach(unit => {
		if (!unit.IsHero)
			return
		let initItemsTarget = XAIOParticleMap.get(unit)
		if (initItemsTarget === undefined) {
			initItemsTarget = new XAIOParticle(unit)
			XAIOParticleMap.set(unit, initItemsTarget)
		}
	})
})

EventsSDK.on("Draw", () => {
	if (ValidPlayerStateGame() || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	UnitsIsControllable.some(unit =>
		!unit.IsEnemy()
		&& hero_modules.get(unit.Name)?.InitDraw(unit)
	)
})