import { EventsSDK, Menu, NotificationsSDK } from "./wrapper/Imports"

const menu = Menu.AddEntryDeep(["Settings", "Notifications"])
menu.AddSlider("Width", NotificationsSDK.size, 175, 350).OnValue(
	slider => (NotificationsSDK.size = slider.value)
)
menu.AddSlider("New Height offset", NotificationsSDK.yOffset, 0, 700).OnValue(
	slider => (NotificationsSDK.yOffset = slider.value)
)
menu.AddSlider("Limit", NotificationsSDK.limit, 2, 6).OnValue(
	slider => (NotificationsSDK.limit = slider.value)
)
menu.AddDropdown("Background cover", ["Octarine", "Dota 2"]).OnValue(
	slider => (NotificationsSDK.backgroundCover = slider.SelectedID)
)
EventsSDK.on("Draw", () => (NotificationsSDK.debug = menu.IsOpen))
