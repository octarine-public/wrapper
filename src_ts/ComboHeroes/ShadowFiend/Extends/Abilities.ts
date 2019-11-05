import { Hero, Ability, Unit } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"
export default class ShadowFiendAbility extends AbilityBase {
	constructor(unit?: Hero | Unit) {
		super(unit)
	}
	public get Shadowraze1(): Ability {
		let name = "nevermore_shadowraze1"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get Shadowraze2(): Ability {
		let name = "nevermore_shadowraze2"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get Shadowraze3(): Ability {
		let name = "nevermore_shadowraze3"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get Requiem(): Ability {
		let name = "nevermore_requiem"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
}
