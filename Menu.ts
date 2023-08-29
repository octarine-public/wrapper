import { Events, Menu } from "./wrapper/Imports"

declare global {
	const reload: () => void
}

const SettingsTree = Menu.AddEntry("Settings")

/** Node Menu  */
const MainMenuKeyBind = SettingsTree.AddKeybind("Menu Bind", "Insert")
MainMenuKeyBind.ActivatesInMenu = true
MainMenuKeyBind.TriggerOnChat = true

const SettingsLanguage = SettingsTree.AddDropdown(
	"Language",
	["English", "Russian"],
	1
)
SettingsLanguage.OnValue(change => {
	if (Menu.MenuManager.emptyConfig) return
	switch (change.SelectedID) {
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

const basePath = "github.com/octarine-public/wrapper/scripts_files/menu/icons/"

const iconReload = basePath + "reload.svg"

/** Node Reload Scripts */
const SettingsReloadTree = SettingsTree.AddNode("Reload Scripts", iconReload)
const ReloadScriptsBind = SettingsReloadTree.AddKeybind("Key Bind")
const ReloadScriptsBtn = SettingsReloadTree.AddButton("Reload")

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
	Menu.MenuManager.IsOpen = !Menu.MenuManager.IsOpen
})

ReloadScriptsBtn.OnValue(() => reload())
ReloadScriptsBind.OnPressed(() => reload())
