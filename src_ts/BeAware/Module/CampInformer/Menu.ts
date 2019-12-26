import { Menu, MenuBase } from "../../abstract/Menu.Base"
export const { BaseTree, State } = MenuBase(Menu, "Camp Informer")
export const alpha = BaseTree.AddSlider("Alpha Font", 255, 0, 255)
export const Size = BaseTree.AddSlider("Image/Text Size", 14, 14, 150)
export const ComboBox = BaseTree.AddSwitcher("Render Style", ["Text", "Image"])
const OtimizeTree = BaseTree.AddNode("Optimize FPS")
export const OtimizeState = OtimizeTree.AddToggle("Enable", true)
export const OtimizeSlider = OtimizeTree.AddSlider("Display creeps in range hero", 2000, 150, 8000)
State.SetTooltip("Display spawn creeps")
