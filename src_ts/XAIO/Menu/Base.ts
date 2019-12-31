import { Menu as MenuSDK } from "wrapper/Imports"
export const Menu = MenuSDK.AddEntry("XAIO")
export const stateGlobal = Menu.AddToggle("Enable", true)

export function XMenu(rootTree: MenuSDK.Node, name: string, tooltip?: string) {
	const BaseTree = rootTree.AddNode(name)

	const SettingsMenu = BaseTree.AddNode("Settings")

	const ComboTree = BaseTree.AddNode("Combo")
	const ComboKey = ComboTree.AddKeybind("Bind Key", "D")

	const DrawingTree = BaseTree.AddNode("Drawing")

	const OrbWalkerTree = ComboTree.AddNode("OrbWalker")
	const ComboOrbWalkerAttack = OrbWalkerTree.AddToggle("Auto attack", true)
	const ComboTypeOrbWalker = OrbWalkerTree.AddSwitcher("Type Run", ["Run to target", "Run to cursor", "None"])

	return {
		BaseTree,
		ComboTree,
		DrawingTree,
		stateGlobal,
		OrbWalkerTree,
		ComboKey,
		ComboOrbWalkerAttack,
		ComboTypeOrbWalker,
		State: tooltip !== undefined
			? SettingsMenu.AddToggle("Enable").SetTooltip(tooltip)
			: SettingsMenu.AddToggle("Enable"),
		NearMouse: SettingsMenu.AddSlider("Near mouse", 500, 50, 1000),
	}
}
