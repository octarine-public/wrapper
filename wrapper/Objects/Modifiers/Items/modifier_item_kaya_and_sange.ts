import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_kaya_and_sange extends Modifier {
	public SetBonusManaCostAmplifier(
		specialName = "manacost_reduction",
		subtract = true
	): void {
		super.SetBonusManaCostAmplifier(specialName, subtract)
	}
}
