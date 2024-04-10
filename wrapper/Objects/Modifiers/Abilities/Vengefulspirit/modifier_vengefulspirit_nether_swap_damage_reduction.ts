import { WrapperClassModifier } from "../../../../Decorators"
import { DAMAGE_TYPES } from "../../../../Enums/DAMAGE_TYPES"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_vengefulspirit_nether_swap_damage_reduction extends Modifier {
	public readonly IsShield = true
	public readonly AbsorbDamageAfterReduction = true
	public readonly AbsorbDamageType = DAMAGE_TYPES.DAMAGE_TYPE_ALL

	protected SetAbsorbDamage(specialName = "damage", _subtract = false) {
		const blockAfter = this.NetworkArmor,
			specialValue = this.GetSpecialValue(specialName)
		this.AbsorbDamage = Math.max(specialValue - blockAfter, 0)
	}
}
