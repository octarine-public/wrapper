import { Menu as MenuSDK } from "wrapper/Imports"

export const Menu = MenuSDK.AddEntry(["Utility", "Unit Blocker"])
export const stateMain = Menu.AddToggle("State")

export function MenuBase(root: MenuSDK.Node, name: string, defaultKey = "") {
	let BaseTree = root.AddNode(name)

	return {
		BaseTree,
		State: BaseTree.AddToggle("State"),
		Key: BaseTree.AddKeybind("Key", defaultKey),
		KeyStyle: BaseTree.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"]),
		Sensitivity: BaseTree.AddSliderFloat("Sensitivity", 16, 0, 35)
			.SetTooltip("Biggest value to smaller blocks but more accurately. Default for many heroes - 16"),
	}
}

export function MenuDraw(root: MenuSDK.Node) {
	let DrawTree = root.AddNode("Draw")

	return {
		DrawTree,
		DrawState: DrawTree.AddToggle("State Draw", true),
		StatusAroundUnits: DrawTree.AddToggle("Status around units(or Heroes)", true),
		StatusMouse: DrawTree.AddToggle("Status around mouse"),
	}
}
