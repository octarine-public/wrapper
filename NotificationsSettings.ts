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

MenuSDK.Localization.AddLocalizationUnit("english", new Map([
	["New Height offset", "Height offset"],
]))

MenuSDK.Localization.AddLocalizationUnit("russian", new Map([
	["Width", "Ширина"],
	["Settings", "Настройки"],
	["Notifications", "Уведомления"],
	["New Height offset", "Смещение по высоте"],
	["Show positions", "Показать позиции"],
	["Limit", "Лимит"],
	["Enable if you want to change the size or position of notifications", "Включите если хотите изменить размер или позицию уведомлений"],
]))

MenuSDK.Localization.AddLocalizationUnit("chinese", new Map([
	["Width", "寬度"],
	["Settings", "設置"],
	["Notifications", "通知"],
	["New Height offset", "高度偏移"],
	["Show positions", "顯示職位"],
	["Limit", "限制"],
	["Enable if you want to change the size or position of notifications", "如果要更改通知的大小或位置，請啟用"],
]))
