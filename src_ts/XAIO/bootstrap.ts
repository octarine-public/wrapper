
import { Unit } from "wrapper/Imports"
import { stateGlobal } from "./Menu/Base"

export let Units: Unit[] = []

interface HeroModule {
	Init(unit: Unit): void
}

let hero_modules = new Map<string, HeroModule>()

export function RegisterHeroModule(name: string, module: HeroModule) {
	hero_modules.set(name, module)
}

EventsSDK.on("Tick", () => {
	if (!stateGlobal.value || LocalPlayer!.IsSpectator)
		return

	Units = EntityManager.GetEntitiesByClass(Unit)
	Units.some(unit =>
		unit.IsAlive
		&& !unit.IsEnemy()
		&& unit.IsControllable
		&& hero_modules.has(unit.Name)
		&& hero_modules.get(unit.Name)!.Init(unit))
})
