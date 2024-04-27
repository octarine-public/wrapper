import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_doom_bringer_devour extends Modifier {
	protected SetBonusArmor(specialName = "armor", subtract = false) {
		super.SetBonusArmor(specialName, subtract)
	}
}
