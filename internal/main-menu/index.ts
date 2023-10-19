import { Events, EventsSDK, InputEventSDK } from "../../wrapper/Imports"
import { InternalHome } from "./Home/Home"
import { InternalSettings } from "./Settings/Settings"

EventsSDK.on("Draw", () => {
	InternalHome.onDraw()
	InternalSettings.onDraw()
})

EventsSDK.on("GameStarted", () => {
	InternalSettings.onGameStarted()
})

Events.on("SetLanguage", language => {
	InternalHome.onSetLanguage(language)
})

Events.on("ScriptsUpdated", () => {
	InternalSettings.onScriptsUpdated()
	console.info("Scripts Updated...")
})

EventsSDK.on("SharedObjectChanged", (id, _, obj) => {
	InternalHome.onSharedObjectChanged(id, obj)
})

InputEventSDK.on("MouseWheel", up => InternalSettings.onMouseWheel(up))
