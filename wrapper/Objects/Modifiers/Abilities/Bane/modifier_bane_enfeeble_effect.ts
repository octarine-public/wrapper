import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bane_enfeeble_effect extends Modifier {
	public readonly IsDebuff = true

	protected SetCastRangeAmplifier(
		specialName = "cast_reduction",
		subtract = true
	): void {
		super.SetCastRangeAmplifier(specialName, subtract)
	}
}
