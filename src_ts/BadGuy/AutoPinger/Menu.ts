import { Menu, MenuBase } from "../Base/MenuBase"
export const { BaseTree, State } = MenuBase(Menu, "Auto Pinger")
export const HeroesList = BaseTree.AddImageSelector("Select ONE hero", [])
export const Interval_val = BaseTree.AddSlider("Interval ping hero", 10, 5, 100)
export const DebugPing = BaseTree.AddToggle("Debug draw mini map")
