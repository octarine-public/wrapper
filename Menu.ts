import { ExecuteOrder, Menu } from "wrapper/Imports"
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

const HumanizerState = SettingsTree.AddToggle(
	"Humanizer",
	false, // add after new humanizer
	"Enables all scripts' orders, ability to change camera distance",
)

const ReloadScripts = () => {
	SetGameInProgress(false)
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

MainMenuKeyBind.OnPressed(() => Menu.MenuManager.is_open = !Menu.MenuManager.is_open)

ReloadScriptsBtn.OnValue(ReloadScripts)
ReloadScriptsBind.OnPressed(ReloadScripts)

HumanizerState.OnValue(toggle => ExecuteOrder.disable_humanizer = !toggle.value)

Menu.Localization.AddLocalizationUnit("russian", new Map([
	["Menu", "Меню"],
	["Language", "Язык"],
	["Bind (Open/Close)", "Бинд (Открыть/Закрыть)"],
	["Humanizer", "Хуманайзер"],
	["English", "Английский"],
	["Russian", "Русский"],
]))
