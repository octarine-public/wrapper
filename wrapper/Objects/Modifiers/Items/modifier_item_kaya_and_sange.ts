import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_kaya_and_sange extends Modifier {
	protected SetStatusResistanceAmplifier(
		specialName = "status_resistance",
		subtract = false
	) {
		super.SetStatusResistanceAmplifier(specialName, subtract)
	}

	public SetBonusManaCostAmplifier(
		specialName = "manacost_reduction",
		subtract = true
	): void {
		super.SetBonusManaCostAmplifier(specialName, subtract)
	}
}
