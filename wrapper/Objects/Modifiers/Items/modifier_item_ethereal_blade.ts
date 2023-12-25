import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ethereal_blade extends Modifier {
	protected UnitPropertyChanged(changed?: boolean): boolean {
		if (!super.UnitPropertyChanged(changed)) {
			return false
		}
		this.BonusCastRange = this.GetSpecialValue("bonus_cast_range")
		return true
	}
}
