import { Ability, Unit } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"
export default class AntiMageAbility extends AbilityBase {
	constructor(unit?: Unit) {
		super(unit)
	}
	public get Blink(): Ability {
		let name = "antimage_blink"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get CounterSpell(): Ability {
		let name = "antimage_counterspell"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get ManaVoid(): Ability {
		let name = "antimage_mana_void"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
}
