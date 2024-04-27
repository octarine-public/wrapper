import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_howl extends Modifier {
	protected SetBonusArmor(specialName = "armor", subtract = true): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
