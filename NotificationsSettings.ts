import { Menu as MenuSDK, NotificationsSDK } from "./wrapper/Imports"

const Menu = MenuSDK.AddEntryDeep(["Settings", "Notifications"])
Menu.AddSlider(
	"Width",
	NotificationsSDK.size,
	175,
	350,
).OnValue(slider => NotificationsSDK.size = slider.value)
Menu.AddSlider(
	"Height offset",
	NotificationsSDK.y_offset,
	150,
	800,
).OnValue(slider => NotificationsSDK.y_offset = slider.value)
Menu.AddToggle(
	"Show positions",
	NotificationsSDK.debug,
	"Enable if you want to change the size or position of notifications",
).OnValue(toggle => NotificationsSDK.debug = toggle.value)

MenuSDK.Localization.AddLocalizationUnit("russian", new Map([
	["Width", "Ширина"],
	["Height offset", "Смещение по высоте"],
	["Show positions", "Показать позиции"],
	["Enable if you want to change the size or position of notifications", "Включите если хотите изменить размер или позицию уведомлений"],
]))
