import {
	Entity,
	Events,
	EventsSDK,
	ExecuteOrder,
	InputEventSDK,
	Menu,
	MenuLanguageID
} from "../../../wrapper/Imports"
import { InternalCamera } from "./Camera"
import { InternalChanger } from "./Changer"
import { InternalConfig } from "./Config"
import { InternalNotifications } from "./Notifications"

new (class CInternalSettings {
	private readonly tree = Menu.AddEntry("Settings")
	private readonly cCamera = new InternalCamera(this.tree)
	private readonly cChanger = new InternalChanger(this.tree)
	private readonly cNotifications = new InternalNotifications(this.tree)
	private readonly cConfig = new InternalConfig(this.tree)

	private readonly reloadTree = this.tree.AddNode(
		"Reload Scripts",
		"menu/icons/reload.svg"
	)

	private readonly menuKeyBind = this.tree.AddKeybind("Menu Bind", "Insert")
	private readonly key = this.reloadTree.AddKeybind("Key Bind")

	constructor() {
		EventsSDK.on("Draw", this.Draw.bind(this))
		EventsSDK.on("GameStarted", this.GameStarted.bind(this))
		Events.on("ScriptsUpdated", this.ScriptsUpdated.bind(this))
		InputEventSDK.on("MouseWheel", this.MouseWheel.bind(this))
		EventsSDK.on("EntityCreated", this.EntityCreated.bind(this))
		EventsSDK.on("HumanizerStateChanged", this.HumanizerStateChanged.bind(this))

		this.tree
			.AddToggle(
				"Humanizer",
				true,
				"Enables all scripts orders, ability to change camera distance"
			)
			.OnValue(toggle => (ExecuteOrder.DisableHumanizer = !toggle.value))

		this.menuKeyBind.ActivatesInMenu = true
		this.menuKeyBind.TriggerOnChat = true
		this.menuKeyBind.OnPressed(
			() => (Menu.MenuManager.IsOpen = !Menu.MenuManager.IsOpen)
		)

		this.tree
			.AddDropdown("Language", ["English", "Russian"], 1)
			.OnValue(call => this.onLangugeChanged(call)).KeepArrowGap = false

		this.reloadTree.AddButton("Reload").OnValue(() => reload())
		this.key.ActivatesInMenu = true
		this.key.OnPressed(() => this.cNotifications.OnBindPressed())
		this.key.OnRelease(() => this.cNotifications.OnBindRelease())
	}

	protected Draw() {
		this.cCamera.Draw()
		this.cConfig.Draw()
		this.cNotifications.Draw()
	}

	protected MouseWheel(up: boolean) {
		return this.cCamera.MouseWheel(up)
	}

	protected GameStarted() {
		this.cChanger.GameStarted()
	}

	protected EntityCreated(entity: Entity) {
		this.cCamera.EntityCreated(entity)
	}

	protected ScriptsUpdated() {
		this.cNotifications.ScriptsUpdated()
		console.info("Scripts Updated...")
	}

	protected HumanizerStateChanged() {
		this.cCamera.HumanizerStateChanged()
	}

	private onLangugeChanged(call: Menu.Dropdown) {
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
