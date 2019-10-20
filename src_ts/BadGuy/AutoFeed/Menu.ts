import { Menu, MenuBase } from "../Base/MenuBase"
let { BaseTree, State } = MenuBase(Menu, "Auto Feed")

let Swhicher = BaseTree.AddSwitcher("Select Controllable", ["Only Hero", "All Controllable unit"], 1),
	DrawStatus = BaseTree.AddNode("Draw Status"),
	DrawState = DrawStatus.AddToggle("Enable", true),
	DrawTextSize = DrawStatus.AddSlider("Text Size", 20, 14, 60)


export {
	State,
	BaseTree,
	Swhicher,
	DrawState,
	DrawTextSize
}