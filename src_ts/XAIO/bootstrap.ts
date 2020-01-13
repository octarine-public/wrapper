
import { Unit, EventsSDK, LocalPlayer, EntityManager } from "wrapper/Imports"
import { stateGlobal, LanguageState } from "./Menu/Base"

export let Units: Unit[] = []

interface HeroModule {
	InitTick(unit: Unit): void
}

let hero_modules = new Map<string, HeroModule>()
let temp_lang = LanguageState.selected_id

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
		&& hero_modules.get(unit.Name)!.InitTick(unit))
})

EventsSDK.on("Draw", () => {
	if (temp_lang === LanguageState.selected_id)
		return
	temp_lang = LanguageState.selected_id
	EventsSDK.emit("GameEnded", false)
	reload("eTE9Te5rgBYThsO", true)
})
