import { Events, Menu } from "./wrapper/Imports"

declare global {
	const reload: () => void
}

const SettingsTree = Menu.AddEntry("Settings")

/** Node Menu  */
const MainMenuKeyBind = SettingsTree.AddKeybind("Menu Bind", "Insert")
MainMenuKeyBind.activates_in_menu = true
MainMenuKeyBind.trigger_on_chat = true

const SettingsLanguage = SettingsTree.AddDropdown("Language", ["English", "Russian"], 1)
SettingsLanguage.OnValue(change => {
	if (Menu.MenuManager.empty_config)
		return
	switch (change.selected_id) {
		case 0:
			Menu.Localization.SelectedUnitName = "english"
			break
		case 1:
			Menu.Localization.SelectedUnitName = "russian"
			break
		case 2:
			Menu.Localization.SelectedUnitName = "chinese"
			break
	}
})

/** Node Reload Scripts */
const SettingsReloadTree = SettingsTree.AddNode("Reload Scripts")
const ReloadScriptsBind = SettingsReloadTree.AddKeybind("Key Bind")
const ReloadScriptsBtn = SettingsReloadTree.AddButton("Reload")

async function ReloadScripts() {
	reload()
}

Events.on("SetLanguage", language => {
	switch (language) {
		default:
		case 0:
			Menu.Localization.PreferredUnitName = "english"
			break
		case 1:
			Menu.Localization.PreferredUnitName = "russian"
			break
		case 2:
			Menu.Localization.PreferredUnitName = "chinese"
			break
	}
})

MainMenuKeyBind.OnPressed(() => {
	Menu.MenuManager.is_open = !Menu.MenuManager.is_open
})

ReloadScriptsBtn.OnValue(ReloadScripts)
ReloadScriptsBind.OnPressed(ReloadScripts)

Menu.Localization.AddLocalizationUnit("russian", new Map([
	["Menu", "Меню"],
	["Language", "Язык"],
	["Settings", "Настройки"],
	["Menu Bind", "Бинд Меню"],
	["Humanizer", "Хуманайзер"],
	["English", "Английский"],
	["Russian", "Русский"],
	["Chinese", "Китайский"],
]))

Menu.Localization.AddLocalizationUnit("chinese", new Map([
	["Menu", "菜單"],
	["Language", "語"],
	["Settings", "設置"],
	["Menu Bind", "菜單綁定"],
	["Humanizer", "人性化者"],
	["English", "英語"],
	["Russian", "俄語"],
	["Chinese", "中國人"],
]))
