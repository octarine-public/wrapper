import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_spy_gadget_aura extends Modifier {
	public SetBonusCastRange(specialName = "cast_range", subtract = false): void {
		super.SetBonusCastRange(specialName, subtract)
	}
}
