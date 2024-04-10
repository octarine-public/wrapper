import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_shield extends Modifier {
	public readonly IsShield = true
	public readonly AbsorbDamageAfterReduction = true
	public readonly AbsorbDamageType = DAMAGE_TYPES.DAMAGE_TYPE_ALL

	public GetTexturePath(small = false) {
		return GetRuneTexture("shield", small)
	}

	protected SetAbsorbDamage(_specialName?: string, _subtract = false) {
		const owner = this.Parent
		if (owner === undefined) {
			this.AbsorbDamage = 0
			return
		}
		const baseBlock = 0.5 * 100 // 50%
		const damageBlockAfter = this.NetworkArmor
		const startDamageBlock = (owner.MaxHP / 100) * baseBlock
		this.AbsorbDamage = Math.max(Math.ceil(startDamageBlock - damageBlockAfter), 0)
	}
}
