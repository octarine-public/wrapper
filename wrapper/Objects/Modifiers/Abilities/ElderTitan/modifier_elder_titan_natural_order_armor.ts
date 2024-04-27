import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_natural_order_armor extends Modifier {
	public readonly IsDebuff = true

	protected SetBaseBonusArmorAmplifier(
		specialName = "armor_reduction_pct",
		subtract = true
	) {
		super.SetBaseBonusArmorAmplifier(specialName, subtract)
	}
}
