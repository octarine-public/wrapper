import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_cast_range extends Modifier {
	public readonly IsHidden = true

	protected SetBonusCastRange(specialName = "value", subtract = false): void {
		super.SetBonusCastRange(specialName, subtract)
	}
}
