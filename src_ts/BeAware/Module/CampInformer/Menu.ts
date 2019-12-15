import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"
export const { BaseTree, State } = MenuBase(Menu, "Camp Informer")
export const { Size, ComboBox } = MenuDrawBase(BaseTree, null, "Render Style", ["Text", "Image"], "Image/Text Size", 14, 14, 150)
export const alpha = BaseTree.AddSlider("Alpha Font", 255, 0, 255)

const OtimizeTree = BaseTree.AddNode("Optimize FPS")
export const OtimizeState = OtimizeTree.AddToggle("Enable", true)
export const OtimizeSlider = OtimizeTree.AddSlider("Display creeps in range hero", 2000, 150, 8000)


State.SetTooltip("Display spawn creeps")
