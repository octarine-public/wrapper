import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("satyr_soulstealer_mana_burn")
export class satyr_soulstealer_mana_burn extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("burn_amount", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const multiplier = this.GetSpecialValue("int_multiplier")
		return super.GetRawDamage(target) + target.TotalIntellect * multiplier
	}
}
