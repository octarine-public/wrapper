import { Menu as MenuSDK } from "wrapper/Imports"
export let Menu = MenuSDK.AddEntry(["Utility", "Bad Guy"])
export let MainState = Menu.AddToggle("State")

export function MenuBase(root: MenuSDK.Node, name: string) {
	let BaseTree = root.AddNode(name)

	return {
		BaseTree,
		State: BaseTree.AddToggle("State"),
	}
}