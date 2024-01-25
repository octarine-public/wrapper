import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tinker_warp_grenade extends Modifier {
	public readonly IsDebuff = true

	protected SetAttackRangeAmplifier(specialName = "range_reduction", subtract = true) {
		super.SetAttackRangeAmplifier(specialName, subtract)
	}

	protected SetCastRangeAmplifier(specialName = "range_reduction", subtract = true) {
		super.SetCastRangeAmplifier(specialName, subtract)
	}
}
