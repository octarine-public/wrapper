import { WrapperClassModifier } from "../../../../Decorators"
import { DAMAGE_TYPES } from "../../../../Enums/DAMAGE_TYPES"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_legion_commander_overwhelming_odds_shield extends Modifier {
	public readonly IsShield: boolean = true
	public readonly AbsorbDamageType = DAMAGE_TYPES.DAMAGE_TYPE_ALL

	protected SetAbsorbDamage(_specialName?: string, _subtract = false) {
		this.AbsorbDamage = Math.max(this.NetworkDamage, 0)
	}
}
