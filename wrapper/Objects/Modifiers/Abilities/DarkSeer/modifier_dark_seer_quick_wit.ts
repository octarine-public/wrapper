import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dark_seer_quick_wit extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "int_to_atkspd",
		_subtract = false
	): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.BonusAttackSpeed = 0
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusAttackSpeed = owner.Intellect * value
	}
}
