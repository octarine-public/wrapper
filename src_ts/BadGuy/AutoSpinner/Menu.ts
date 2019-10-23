import { Menu, MenuBase } from "../Base/MenuBase"
let { BaseTree, State } = MenuBase(Menu, "Auto Spinner")

let SpinnerKey = BaseTree.AddKeybind("Key"),
	ModeSpinner = BaseTree.AddSwitcher("Mode", ["One place", "Circle"], 0)

export {
	State,
	BaseTree,
	ModeSpinner,
	SpinnerKey,
}