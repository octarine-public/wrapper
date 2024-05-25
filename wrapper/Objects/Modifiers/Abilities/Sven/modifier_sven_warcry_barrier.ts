import { WrapperClassModifier } from "../../../../Decorators"
import { DAMAGE_TYPES } from "../../../../Enums/DAMAGE_TYPES"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_warcry_barrier extends Modifier {
	public readonly IsShield = true
	public readonly AbsorbDamageType = DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL

	protected SetAbsorbDamage(_specialName?: string, _subtract = false) {
		this.AbsorbDamage = Math.max(this.NetworkDamage, 0)
	}
}
