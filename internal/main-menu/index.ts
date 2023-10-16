import { Events, EventsSDK, InputEventSDK } from "../../wrapper/Imports"
import { internalHomeMenu } from "./Home/index"
import { internalCamera } from "./Settings/Camera"
import { internalChanger } from "./Settings/Changer"
import { internalNotifications } from "./Settings/Notifications"

EventsSDK.on("Draw", () => {
	internalCamera.Draw()
	internalHomeMenu.Draw()
	internalNotifications.Draw()
})

EventsSDK.on("GameStarted", () => {
	internalChanger.GameStarted()
})

Events.on("SetLanguage", language => {
	internalHomeMenu.SetLanguage(language)
})

Events.on("ScriptsUpdated", () => {
	internalNotifications.ScriptsUpdated()
	console.info("Scripts Updated...")
})

EventsSDK.on("SharedObjectChanged", (id, _, obj) => {
	internalHomeMenu.SharedObjectChanged(id, obj)
})

InputEventSDK.on("MouseWheel", up => internalCamera.MouseWheel(up))
