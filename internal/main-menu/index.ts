import { Events, EventsSDK, InputEventSDK } from "../../wrapper/Imports"
import { InternalHome } from "./Home/Home"
import { InternalSettings } from "./Settings/Settings"

EventsSDK.on("Draw", () => {
	InternalHome.Draw()
	InternalSettings.Draw()
})

EventsSDK.on("GameStarted", () => {
	InternalSettings.GameStarted()
})

Events.on("SetLanguage", language => {
	InternalHome.SetLanguage(language)
})

Events.on("ScriptsUpdated", () => {
	InternalSettings.ScriptsUpdated()
	console.info("Scripts Updated...")
})

EventsSDK.on("SharedObjectChanged", (id, _, obj) => {
	InternalHome.SharedObjectChanged(id, obj)
})

EventsSDK.on("HumanizerStateChanged", () => {
	InternalSettings.HumanizerStateChanged()
})

InputEventSDK.on("MouseWheel", up => InternalSettings.MouseWheel(up))
