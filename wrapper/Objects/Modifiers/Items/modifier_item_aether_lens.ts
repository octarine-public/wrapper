import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_aether_lens extends Modifier {
	protected UnitPropertyChanged(changed?: boolean): boolean {
		if (!super.UnitPropertyChanged(changed)) {
			return false
		}
		this.BonusCastRange = this.GetSpecialValue("cast_range_bonus")
		return true
	}
}
