import { Hero, Ability, Unit } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"
export default class ClinkzAbility extends AbilityBase {
	constructor(unit?: Hero | Unit) {
		super(unit)
	}
	public get Strafe(): Ability {
		let name = "clinkz_strafe"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get SearingArrows(): Ability  {
		let name = "clinkz_searing_arrows"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get BurningArmy(): Ability  {
		let name = "clinkz_burning_army"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
}
