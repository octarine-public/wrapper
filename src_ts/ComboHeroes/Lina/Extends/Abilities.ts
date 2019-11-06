import { Ability, Hero, Unit } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"
export default class LinaAbility extends AbilityBase {
	constructor(unit?: Hero | Unit) {
		super(unit)
	}
	public get DragonSlave(): Ability {
		let name = "lina_dragon_slave"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get LightStrikeArray(): Ability {
		let name = "lina_light_strike_array"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get LagunaBlade(): Ability {
		let name = "lina_laguna_blade"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
}
