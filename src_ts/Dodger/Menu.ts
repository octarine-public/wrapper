import { Menu } from "wrapper/Imports";
let MenuTree = Menu.AddEntry(["Utility", "Dodger"]),
	MenuState = MenuTree.AddToggle("State"),
	EnemyHeroes = MenuTree.AddNode("Enemy settings"),
	AllyHeroes = MenuTree.AddNode("Ally settings")

export {
	MenuState,
	EnemyHeroes,
	AllyHeroes
}