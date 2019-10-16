import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"
const { BaseTree, State } = MenuBase(Menu, "Camp Informer"),
	{ Size, ComboBox } = MenuDrawBase(BaseTree, null, "Render Style", ["Text", "Image"], "Image/Text Size", 14, 14, 150),
	alpha = BaseTree.AddSlider("Alpha Font", 255, 0, 255)

State.SetTooltip("Display spawn creeps")
export { State, Size, ComboBox, alpha };
