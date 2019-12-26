import { Menu, MenuBase } from "../Base/MenuBase"
let { BaseTree, State } = MenuBase(Menu, "Auto Laugh")
let Interval = BaseTree.AddSlider("Delay", 15, 15, 120)
export {
	State,
	BaseTree,
	Interval
}
