import { Menu, MenuBase } from "../../abstract/MenuBase"
const { BaseTree, State } = MenuBase(Menu, "Auto Glyph")
let TowerSwitcher = BaseTree.AddSwitcher("Select", ["Only T1 towers", "Only T2 towers", "Only T3 towers", "Only T4 towers", "All Towers", "All Building"], 0),
	TowerHP = BaseTree.AddSlider("Health", 100, 1, 500)
export {
	State,
	TowerHP,
	TowerSwitcher
}
