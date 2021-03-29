import { EventsSDK, Menu } from "wrapper/Imports"
import { SetGameInProgress } from "./wrapper/Objects/Base/Entity"

declare global {
	const reload: () => void
}

const SettingsTree = Menu.AddEntry("Settings")

/** Node Menu  */
const MainMenuTree = SettingsTree.AddNode("Menu")
const SettingsLanguage = MainMenuTree.AddDropdown("Language", ["English", "Russian"])
const MainMenuKeyBind = MainMenuTree.AddKeybind("Bind (Open/Close)", "Insert")
MainMenuKeyBind.activates_in_menu = true
MainMenuKeyBind.trigger_on_chat = true

/** Node Reload Scripts */
const SettingsReloadTree = SettingsTree.AddNode("Reload Scripts")
const ReloadScriptsBind = SettingsReloadTree.AddKeybind("Key Bind")
const ReloadScriptsBtn = SettingsReloadTree.AddButton("Reload")

async function ReloadScripts() {
	await SetGameInProgress(false)
	reload()
}

SettingsLanguage.OnValue(change => {
	switch (change.selected_id) {
		case 0:
			Menu.Localization.SelectedUnitName = "english"
			break
		case 1:
			Menu.Localization.SelectedUnitName = "russian"
			break
	}
})
EventsSDK.on("Draw", () => {
	if (
		Menu.Localization.SelectedUnitName === "english"
		&& SettingsLanguage.selected_id !== 0
	) {
		SettingsLanguage.selected_id = 0
		SettingsLanguage.Update()
	}
	if (
		Menu.Localization.SelectedUnitName === "russian"
		&& SettingsLanguage.selected_id !== 1
	) {
		SettingsLanguage.selected_id = 1
		SettingsLanguage.Update()
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
	["Bind (Open/Close)", "Бинд (Открыть/Закрыть)"],
	["Humanizer", "Хуманайзер"],
	["English", "Английский"],
	["Russian", "Русский"],
]))
