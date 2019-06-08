import { MenuManager } from "../../CrutchesSDK/Imports";

export function MenuBase(root: MenuManager.MenuControllers.Tree, name: string, defaultKey = "") {

	let BaseTree = root.AddTree(name);
	
	return {
		BaseTree,
		State: BaseTree.AddToggle("State - " + BaseTree.name),
		Key: BaseTree.AddKeybind("Key", defaultKey),
		KeyStyle: BaseTree.AddComboBox("Key Style", ["Hold key", "Turn on / Turn off"]),
		Sensitivity: BaseTree.AddSliderFloat("Sensitivity", 16, 0, 35)
			.SetToolTip("Biggest value to smaller blocks but more accurately. Default for many heroes - 16"),
		CenterCamera: BaseTree.AddToggle("Center Camera")
			.SetToolTip("Only on Local Hero"),
	}
}


export function MenuDraw(root: MenuManager.MenuControllers.Tree) {

	let DrawTree = root.AddTree("Draw - " + root.name);

	return {
		DrawTree,
		DrawState: DrawTree.AddToggle("State Draw - " + root.name),
		PredictionParticle: DrawTree.AddToggle("Prediction particle"),
		StatusMouse: DrawTree.AddToggle("Status around mouse")
	}
}