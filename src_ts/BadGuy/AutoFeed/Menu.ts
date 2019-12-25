import { Menu, MenuBase } from "../Base/MenuBase"
export const { BaseTree, State } = MenuBase(Menu, "Auto Feed")

export const SwitchUnit = BaseTree.AddSwitcher("Select", ["Only heroes", "All controllable unit"], 1)
export const DrawStatus = BaseTree.AddNode("Draw Status")
export const DrawState = DrawStatus.AddToggle("Enable", true)
export const DrawTextSize = DrawStatus.AddSlider("Text Size", 20, 14, 60)
