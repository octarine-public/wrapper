import { WrapperClassModifier } from "../../../../Decorators"
import { DAMAGE_TYPES } from "../../../../Enums/DAMAGE_TYPES"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_furion_teleport_shield extends Modifier {
	public readonly IsShield = true
	public readonly AbsorbDamageAfterReduction = true
	public readonly AbsorbDamageType = DAMAGE_TYPES.DAMAGE_TYPE_ALL

	protected SetAbsorbDamage(specialName = "barrier", _subtract = false) {
		const currDamage = this.NetworkDamage
		const specialValue = this.GetSpecialValue(specialName)
		this.AbsorbDamage = Math.max(specialValue - currDamage, 0)
	}
}
