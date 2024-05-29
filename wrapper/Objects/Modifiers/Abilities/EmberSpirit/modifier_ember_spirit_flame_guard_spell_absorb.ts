import { WrapperClassModifier } from "../../../../Decorators"
import { DAMAGE_TYPES } from "../../../../Enums/DAMAGE_TYPES"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ember_spirit_flame_guard_spell_absorb extends Modifier {
	public readonly IsShield = true
	public readonly AbsorbDamageType = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL

	protected SetAbsorbDamage(_specialName?: string, _subtract = false) {
		this.AbsorbDamage = Math.max(this.NetworkArmor, 0)
	}
}
