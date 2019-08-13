import { MenuManager } from "wrapper/Imports"
export const Menu = MenuManager.MenuFactory("Item Manager")
export const StateBase = Menu.AddToggle("State", false);

export function MenuBase(root: MenuManager.MenuControllers.Tree, name: string, tooltip?: string) {
	let BaseTree = root.AddTree(name)
	return {
		BaseTree,
		State: tooltip != undefined
			? BaseTree.AddToggle(BaseTree.name + " - State", true).SetToolTip(tooltip)
			: BaseTree.AddToggle(BaseTree.name + " - State", true),
	}
}