import { Menu, MenuBase } from "../Base/MenuBase"
let { BaseTree, State } = MenuBase(Menu, "Auto Spinner")

let SpinnerKey = BaseTree.AddKeybind("Key"),
	Swhicher = BaseTree.AddSwitcher("Select Controllable", ["Only Hero", "All Controllable unit"], 0),
	ModeSpinner = BaseTree.AddSwitcher("Mode", ["One place", "Circle"], 0)

export {
	State,
	BaseTree,
	Swhicher,
	ModeSpinner,
	SpinnerKey,
}