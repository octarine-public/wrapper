import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_warlock_upheaval_ally extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackSpeed(_specialName?: string, subtract = false): void {
		const value = this.NetworkDamage
		this.BonusAttackSpeed = subtract ? value * -1 : value
	}
}
