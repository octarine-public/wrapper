//@ts-nocheck
import { Ability, Hero, Unit } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"
export default class AbilityX extends AbilityBase {
	constructor(unit?: Hero | Unit) {
		super(unit)
	}
	public get AetherRemnan(): Ability {
		let name = "void_spirit_aether_remnant"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get Dissimilate(): Ability {
		let name = "void_spirit_dissimilate"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get ResonantPulse(): Ability {
		let name = "void_spirit_resonant_pulse"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get AstralStep(): Ability {
		let name = "void_spirit_astral_step"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
}
