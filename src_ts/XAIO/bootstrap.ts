
import { Unit, EventsSDK, LocalPlayer, EntityManager, EventEmitter } from "wrapper/Imports"
import { XAIOStateGlobal, XAIOLanguageState, XAIOGeneralSettings } from "XAIO/Menu/Menu"
export { XAIOStateGlobal } from "XAIO/Menu/Menu"
let XAIOversion = XAIOGeneralSettings.AddNode("XAIO Verison: 1.0")

XAIOversion.FontSize = 20
XAIOversion.is_open = true
XAIOversion.FontColor.SetColor(3, 127, 252, 255)

interface XAIOEvents extends EventEmitter {
	on(name: "removeControllable", callback: (unit: Unit) => void): EventEmitter
}

export let Units: Unit[] = []
export let UnitsIsControllable: Unit[] = []
export const XAIOEvents: XAIOEvents = new EventEmitter()

let XIAOTempLanguage = XAIOLanguageState.selected_id

EventsSDK.on("Tick", () => {
	if (!XAIOStateGlobal.value || LocalPlayer!.IsSpectator)
		return

	Units = EntityManager.GetEntitiesByClass(Unit)

	let newUnitsCtrl = Units.filter(x => x.IsControllable && x.IsAlive && !x.IsInvulnerable)

	UnitsIsControllable.forEach(unit => {
		if (!newUnitsCtrl.includes(unit))
			XAIOEvents.emit("removeControllable", false, unit)
	})
	UnitsIsControllable = newUnitsCtrl
})

EventsSDK.on("Draw", () => {
	XAIOversion.is_open = true
	if (XIAOTempLanguage === XAIOLanguageState.selected_id)
		return
	XIAOTempLanguage = XAIOLanguageState.selected_id
	EventsSDK.emit("GameEnded", false)
	reload("eTE9Te5rgBYThsO", true)
})

EventsSDK.on("GameEnded", () => {
	Units = []
})

