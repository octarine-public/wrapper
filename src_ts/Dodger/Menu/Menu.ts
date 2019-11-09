import { Unit, Menu, Ability } from "wrapper/Imports";
import { EnemyHeroes, AllyHeroes } from "../Menu";
import { HelperMenu } from "./Helper";
export default class DodgerMenu extends HelperMenu {
	constructor(unit: Unit) {
		super(unit)
	}
	public AddNodeInMenu(abiilty: Ability, Tree: Menu.Node, NameHero: string) {
		let addHero = Tree.AddNode(this.ucFirst(NameHero)),
			NameAbilityTree = abiilty.Name.toString().split("_").splice(1, 4).join(" ")
		addHero.AddNode(this.ucFirst(NameAbilityTree))
	}
	public AddTreeInHero(x: Unit, NameHero: string, abiilty: Ability) {
		x.IsEnemy()
			? this.AddNodeInMenu(abiilty, EnemyHeroes, NameHero)
			: this.AddNodeInMenu(abiilty, AllyHeroes, NameHero)
	}
}