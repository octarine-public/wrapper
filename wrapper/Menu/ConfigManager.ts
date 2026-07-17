import { Events } from "../Managers/Events"
import { Base } from "./Base"
import { ConfigWindow } from "./ConfigWindow"
import { MenuManager } from "./Menu"

async function reloadGuarded(): Promise<void> {
	const prevNoWrite = Base.NoWriteConfig
	Base.SaveConfigASAP = false
	Base.NoWriteConfig = true
	try {
		await MenuManager.ReloadConfig()
		MenuManager.foreachRecursive(el => el.InvalidateConfig())
		Base.ForwardConfigASAP = true
	} finally {
		Base.SaveConfigASAP = false
		Base.NoWriteConfig = prevNoWrite
	}
}

export function setupConfigsMenu(): void {
	if (typeof listConfigs !== "function") {
		return // older core without the config bindings
	}

	ConfigWindow.SetReloadHandler(reloadGuarded)

	const node = MenuManager.AddEntry("Settings").AddNode(
		"Cloud configs",
		"menu/icons/cloud-config.svg"
	)
	node.AddButton("Open").OnValue(() => ConfigWindow.Show())
	const openKey = node.AddKeybind("Open hotkey", "")
	openKey.ActivatesInMenu = true
	openKey.OnPressed(() => {
		if (ConfigWindow.IsOpen) {
			ConfigWindow.Close()
		} else {
			ConfigWindow.Show()
		}
	})

	Events.on("ConfigsChanged", () => {
		void reloadGuarded()
		ConfigWindow.RequestRefresh()
	})
	let wasOpen = false
	Events.after("Draw", () => {
		const open = node.IsOpen
		if (open && !wasOpen && !ConfigWindow.IsOpen) {
			ConfigWindow.Show()
		}
		wasOpen = open
	})
}
