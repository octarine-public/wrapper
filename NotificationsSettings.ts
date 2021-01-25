import { Menu as MenuSDK, NotificationsSDK } from "./wrapper/Imports"

const Menu = MenuSDK.AddEntryDeep(["Settings", "Notifications"])
Menu.AddSlider(
	"Size",
	NotificationsSDK.size,
	50,
	100,
).OnValue(slider => NotificationsSDK.size = slider.value)
Menu.AddSlider(
	"Position",
	NotificationsSDK.y_offset,
	200,
	1000,
).OnValue(slider => NotificationsSDK.y_offset = slider.value)
Menu.AddToggle(
	"Show positions",
	NotificationsSDK.debug,
	"Enable if you want to change the size or position of notifications",
).OnValue(toggle => NotificationsSDK.debug = toggle.value)

MenuSDK.Localization.AddLocalizationUnit("russian", new Map([
	["Size", "Размер"],
	["Position", "Позиция"],
	["Show positions", "Показать позиции"],
	["Enable if you want to change the size or position of notifications", "Включите если хотите изменить размер или позицию уведомлений"],
]))
