import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_mysterious_hat extends Modifier {
	protected SetBonusManaCostAmplifier(
		specialName = "manacost_reduction",
		subtract = true
	): void {
		super.SetBonusManaCostAmplifier(specialName, subtract)
	}
}
