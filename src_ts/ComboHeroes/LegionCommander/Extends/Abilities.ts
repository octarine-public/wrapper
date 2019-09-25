import { Ability, Hero } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"
export default class LegionCommanderAbility extends AbilityBase {
	constructor(unit?: Hero) {
		super(unit)
	}
	public get Overwhelming(): Ability {
		return this.unit.GetAbilityByName("legion_commander_overwhelming_odds")
	}
	public get PressTheAttack(): Ability {
		return this.unit.GetAbilityByName("legion_commander_press_the_attack")
	}
	public get Duel(): Ability {
		return this.unit.GetAbilityByName("legion_commander_duel")
	}
}
