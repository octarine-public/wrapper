
import { Unit, EventsSDK, LocalPlayer, EntityManager } from "wrapper/Imports"
import { XAIOStateGlobal, XAIOLanguageState, XAIOGeneralSettings } from "XAIO/Menu/Menu"
import { XAIOEvents } from "./Core/bootstrap"
import { SetGameInProgress } from "../wrapper/Managers/EventsHandler"
export { XAIOStateGlobal } from "XAIO/Menu/Menu"
let XAIOversion = XAIOGeneralSettings.AddNode("XAIO Verison: 1.3")

XAIOversion.FontSize = 20
XAIOversion.is_open = true
XAIOversion.FontColor.SetColor(3, 127, 252, 255)

export let Units: Unit[] = []
export let UnitsIsControllable: Unit[] = []

let XIAOTempLanguage = XAIOLanguageState.selected_id

EventsSDK.on("Tick", () => {
	if (!XAIOStateGlobal.value || LocalPlayer!.IsSpectator)
		return

	Units = EntityManager.GetEntitiesByClass(Unit)

	let newUnitsCtrl = Units.filter(x => x.IsControllable && x.IsAlive)

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
	SetGameInProgress(false)
	reload("eTE9Te5rgBYThsO", true)
})

EventsSDK.on("GameEnded", () => {
	Units = []
	UnitsIsControllable = []
})

