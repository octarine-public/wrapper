import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"
const { BaseTree, State } = MenuBase(Menu, "Camp Informer")
const { Size, ComboBox } = MenuDrawBase(BaseTree, null, "Render Style", ["Text", "Image"], "Size", 14, 16, 150)
const alpha = BaseTree.AddSlider("Alpha Font", 255, 0, 255)
State.SetToolTip("Display spawn creeps")
export { State, Size, ComboBox, alpha };
