import { Menu, MenuBase } from "../../abstract/Menu.Base"
const { BaseTree, State } = MenuBase(Menu, "Tower Range", "(Eyes in the forest)")
let TowerOnlyTarget = BaseTree.AddToggle("Show only target"),
	TowerSwitcher = BaseTree.AddSwitcher("Tower Radius", ["Only Enemy", "Only Alies", "Alies and Enemy"])
export { State, TowerSwitcher, TowerOnlyTarget };
