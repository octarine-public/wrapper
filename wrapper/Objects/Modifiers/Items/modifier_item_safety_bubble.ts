import { WrapperClassModifier } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_safety_bubble extends Modifier {
	public readonly IsShield = true
	public readonly AbsorbDamageAfterReduction = true
	public readonly AbsorbDamageType = DAMAGE_TYPES.DAMAGE_TYPE_ALL

	protected SetAbsorbDamage(specialName = "shield", _subtract = false) {
		const damageBlockAfter = this.NetworkArmor
		let absorbAmount = this.GetSpecialValue(specialName)
		if (damageBlockAfter !== 0) {
			absorbAmount = absorbAmount - damageBlockAfter
		}
		this.AbsorbDamage = Math.max(absorbAmount, 0)
	}
}
