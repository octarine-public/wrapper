import { Menu, MenuBase } from "../../abstract/Menu.Base"
let Building = Menu.AddNode("Building")
const { BaseTree, State } = MenuBase(Building, "Tower Range", "(Eyes in the forest)")
let TowerOnlyTarget = BaseTree.AddToggle("Show only target"),
	TowerSwitcher = BaseTree.AddSwitcher("Tower Radius", ["Only Enemy", "Only Alies", "Alies and Enemy"])
export { State, TowerSwitcher, TowerOnlyTarget };
