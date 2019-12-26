import { Menu as MenuSDK } from "wrapper/Imports"
export const Menu = MenuSDK.AddEntry(["Visual", "Be Aware"])
export const stateMain = Menu.AddToggle("State", true)

export function MenuBase(root: MenuSDK.Node, name: string, tooltip?: string) {
	let BaseTree = root.AddNode(name)

	return {
		BaseTree,
		State: tooltip !== undefined
			? BaseTree.AddToggle("State", true).SetTooltip(tooltip)
			: BaseTree.AddToggle("State", true),
	}
}
