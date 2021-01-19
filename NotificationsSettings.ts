import { Menu as MenuSDK, NotificationsSDK } from "./wrapper/Imports"

const Menu = MenuSDK.AddEntryDeep(["Settings", "Notifications"])
Menu.AddSlider(
	"Notifications size",
	NotificationsSDK.size,
	50,
	100,
).OnValue(slider => NotificationsSDK.size = slider.value)
Menu.AddSlider(
	"Notifications position",
	NotificationsSDK.y_offset,
	200,
	1000,
).OnValue(slider => NotificationsSDK.y_offset = slider.value)
Menu.AddToggle(
	"Show notifications positions",
	NotificationsSDK.debug,
	"Enable if you want to change the size or position of notifications",
).OnValue(toggle => NotificationsSDK.debug = toggle.value)

MenuSDK.Localization.AddLocalizationUnit("russian", new Map([
	["Notifications size", "Размер уведомлений"],
	["Notifications position", "Позиции уведомлений"],
	["Show notifications positions", "Показать позиции уведомлений"],
	["Enable if you want to change the size or position of notifications", "Включите если хотите изменить размер или позицию уведомлений"],
]))
