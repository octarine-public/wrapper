import { ExecuteOrder, Menu, MenuLanguageID } from "../../../wrapper/Imports"
import { InternalCamera } from "./Camera"
import { InternalChanger } from "./Changer"
import { InternalNotifications } from "./Notifications"

export const InternalSettings = new (class {
	private readonly Tree: Menu.Node
	private readonly InternalCamera: InternalCamera
	private readonly InternalChanger: InternalChanger
	private readonly InternalNotifications: InternalNotifications

	constructor() {
		this.Tree = Menu.AddEntry("Settings")

		this.InternalCamera = new InternalCamera(this.Tree)
		this.InternalChanger = new InternalChanger(this.Tree)
		this.InternalNotifications = new InternalNotifications(this.Tree)

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
			this.onLangugeChanged(call)
		)

		/** Node Reload Scripts */
		const reloadTree = this.Tree.AddNode("Reload Scripts", "menu/icons/reload.svg")
		reloadTree.AddKeybind("Key Bind").OnRelease(() => reload())
		reloadTree.AddButton("Reload").OnValue(() => reload())
		/** end Node Reload Scripts */
	}

	public Draw() {
		this.InternalCamera.Draw()
	}

	public MouseWheel(up: boolean) {
		return this.InternalCamera.onMouseWheel(up)
	}

	public GameStarted() {
		this.InternalChanger.GameStarted()
	}

	public ScriptsUpdated() {
		this.InternalNotifications.ScriptsUpdated()
	}

	protected onLangugeChanged(call: Menu.Dropdown) {
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
