import { EventsSDK, Menu as MenuSDK, NotificationsSDK } from "./wrapper/Imports"

const Menu = MenuSDK.AddEntryDeep(["Settings", "Notifications"])
Menu.AddSlider(
	"Width",
	NotificationsSDK.size,
	175,
	350,
).OnValue(slider => NotificationsSDK.size = slider.value)
Menu.AddSlider(
	"New Height offset",
	NotificationsSDK.y_offset,
	0,
	700,
).OnValue(slider => NotificationsSDK.y_offset = slider.value)
Menu.AddSlider(
	"Limit",
	NotificationsSDK.limit,
	2,
	6,
).OnValue(slider => NotificationsSDK.limit = slider.value)
EventsSDK.on("Draw", () => NotificationsSDK.debug = Menu.is_open)
