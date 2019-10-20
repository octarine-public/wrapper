import { Menu as MenuSDK } from "wrapper/Imports"
export const Menu = MenuSDK.AddEntry(["Utility", "Bad Guy"])
export const MainState = Menu.AddToggle("State")

export function MenuBase(root: MenuSDK.Node, name: string, tooltip?: string) {
	let BaseTree = root.AddNode(name)

	return {
		BaseTree,
		State: tooltip !== undefined
			? BaseTree.AddToggle("State").SetTooltip(tooltip)
			: BaseTree.AddToggle("State"),
	}
}