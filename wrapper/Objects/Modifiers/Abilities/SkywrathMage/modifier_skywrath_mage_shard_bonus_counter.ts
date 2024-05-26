import { WrapperClassModifier } from "../../../../Decorators"
import { DAMAGE_TYPES } from "../../../../Enums/DAMAGE_TYPES"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_skywrath_mage_shard_bonus_counter extends Modifier {
	public readonly IsShield = true
	public readonly AbsorbDamageType = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL

	protected SetAbsorbDamage(specialName = "damage_barrier_base", _subtract = false) {
		const owner = this.Parent
		if (owner === undefined) {
			this.AbsorbDamage = 0
			return
		}
		const specialValue = this.GetSpecialValue(specialName)
		this.AbsorbDamage = (owner.Level + specialValue) * this.StackCount
	}
}
