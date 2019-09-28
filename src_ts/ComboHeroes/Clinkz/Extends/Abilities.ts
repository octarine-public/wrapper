import { Hero, Ability } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"
export class ClinkzAbility extends AbilityBase {
	constructor(unit: Hero) {
		super(unit)
	}
	public get Strafe(): Ability {
		return this.unit.GetAbilityByName("clinkz_strafe")
	}
	public get SearingArrows(): Ability {
		return this.unit.GetAbilityByName("clinkz_searing_arrows")
	}
	public get BurningArmy(): Ability {
		return this.unit.GetAbilityByName("clinkz_burning_army")
	}
}
