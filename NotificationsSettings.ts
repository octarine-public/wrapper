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
	["Settings", "Настройки"],
	["Notifications", "Уведомления"],
	["Height offset", "Смещение по высоте"],
	["Show positions", "Показать позиции"],
	["Enable if you want to change the size or position of notifications", "Включите если хотите изменить размер или позицию уведомлений"],
]))


MenuSDK.Localization.AddLocalizationUnit("chinese", new Map([
	["Width", "寬度"],
	["Settings", "設置"],
	["Notifications", "通知"],
	["Height offset", "高度偏移"],
	["Show positions", "顯示職位"],
	["Enable if you want to change the size or position of notifications", "如果要更改通知的大小或位置，請啟用"],
]))
