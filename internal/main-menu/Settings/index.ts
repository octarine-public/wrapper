import { ExecuteOrder, Menu, MenuLanguageID } from "../../../wrapper/Imports"

export const internalSettingsMenu = new (class {
	public readonly Tree: Menu.Node

	constructor() {
		this.Tree = Menu.AddEntry("Settings")

		this.Tree.AddToggle(
			"Humanizer",
			true,
			"Enables all scripts orders, ability to change camera distance"
		).OnValue(toggle => (ExecuteOrder.DisableHumanizer = !toggle.value))

		const menuKeyBind = this.Tree.AddKeybind("Menu Bind", "Insert")
		menuKeyBind.ActivatesInMenu = true
		menuKeyBind.TriggerOnChat = true
		menuKeyBind.OnPressed(() => {
			Menu.MenuManager.IsOpen = !Menu.MenuManager.IsOpen
		})

		this.Tree.AddDropdown("Language", ["English", "Russian"], 1).OnValue(call =>
			this.OnLangugeChanged(call)
		)

		/** Node Reload Scripts */
		const reloadTree = this.Tree.AddNode("Reload Scripts", "menu/icons/reload.svg")
		reloadTree.AddKeybind("Key Bind").OnPressed(() => reload())
		reloadTree.AddButton("Reload").OnValue(() => reload())
		/** end Node Reload Scripts */
	}

	protected OnLangugeChanged(call: Menu.Dropdown) {
		if (Menu.MenuManager.emptyConfig) {
			return
		}
		switch (call.SelectedID) {
			case MenuLanguageID.english:
				Menu.Localization.SelectedUnitName = "english"
				break
			case MenuLanguageID.russian:
				Menu.Localization.SelectedUnitName = "russian"
				break
			case MenuLanguageID.chinese:
				Menu.Localization.SelectedUnitName = "chinese"
				break
		}
	}
})()
