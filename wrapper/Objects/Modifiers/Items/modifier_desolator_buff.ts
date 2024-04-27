import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_desolator_buff extends Modifier {
	protected SetBonusArmor(specialName = "corruption_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
