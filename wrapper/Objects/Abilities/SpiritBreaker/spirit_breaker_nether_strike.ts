import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_spirit_breaker_greater_bash } from "../../Modifiers/Abilities/SpiritBreaker/modifier_spirit_breaker_greater_bash"

@WrapperClass("spirit_breaker_nether_strike")
export class spirit_breaker_nether_strike extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level) // additional damage with bash
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		let damage = super.GetRawDamage(target)
		const modifier = owner.GetBuffByClass(modifier_spirit_breaker_greater_bash)
		if (modifier !== undefined) {
			damage += modifier.GetRawDamage(target)
		}
		return damage
	}
}
