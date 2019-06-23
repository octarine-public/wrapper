import { MenuManager } from "wrapper/Imports";

export const Menu = MenuManager.MenuFactory("Unit Blocker");
export const stateMain = Menu.AddToggle("State");

export function MenuBase(root: MenuManager.MenuControllers.Tree, name: string, defaultKey = "") {

	let BaseTree = root.AddTree(name);
	
	return {
		BaseTree,
		State: BaseTree.AddToggle(BaseTree.name + " - State"),
		Key: BaseTree.AddKeybind("Key", defaultKey),
		KeyStyle: BaseTree.AddComboBox("Key Style", ["Hold key", "Turn on / Turn off"]),
		Sensitivity: BaseTree.AddSliderFloat("Sensitivity", 16, 0, 35)
			.SetToolTip("Biggest value to smaller blocks but more accurately. Default for many heroes - 16"),
	}
}


export function MenuDraw(root: MenuManager.MenuControllers.Tree) {

	let DrawTree = root.AddTree(root.name + " - Draw");

	return {
		DrawTree,
		DrawState: DrawTree.AddToggle(root.name + " - State Draw", true),
		StatusAroundUnits: DrawTree.AddToggle("Status around units(or Heroes)", true),
		StatusMouse: DrawTree.AddToggle("Status around mouse")
	}
}