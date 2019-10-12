import { Menu, MenuBase } from "../../abstract/MenuBase"
const { BaseTree, State } = MenuBase(Menu, "Auto Glyph")
let TowerHP = BaseTree.AddSlider("Health", 100, 1, 500)
export {
	State,
	TowerHP
}