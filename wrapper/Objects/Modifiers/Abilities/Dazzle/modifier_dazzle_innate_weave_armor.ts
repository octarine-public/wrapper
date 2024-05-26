import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dazzle_innate_weave_armor extends Modifier {
	public SetBonusArmor(specialName = "armor_change", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
