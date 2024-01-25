import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_psychic_headband extends Modifier {
	public readonly IsHidden = true

	protected SetBonusCastRange(specialName = "cast_range", subtract = false): void {
		super.SetBonusCastRange(specialName, subtract)
	}
}
