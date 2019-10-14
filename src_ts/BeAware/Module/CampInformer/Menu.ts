import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"
let CapmInformer = Menu.AddNode("Creeps")
const { BaseTree, State } = MenuBase(CapmInformer, "Camp Informer"),
	{ Size, ComboBox } = MenuDrawBase(BaseTree, null, "Render Style", ["Text", "Image"], "Size - Image/Text", 14, 14, 150),
	alpha = BaseTree.AddSlider("Alpha Font", 255, 0, 255)

State.SetTooltip("Display spawn creeps")
export { State, Size, ComboBox, alpha };
