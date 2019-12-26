//@ts-nocheck
import { Ability, Hero } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"
export default class LegionCommanderAbility extends AbilityBase {
	constructor(unit?: Hero) {
		super(unit)
	}
	public get Overwhelming(): Ability {
		let name = "legion_commander_overwhelming_odds"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get PressTheAttack(): Ability {
		let name = "legion_commander_press_the_attack"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get Duel(): Ability {
		let name = "legion_commander_duel"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
}
