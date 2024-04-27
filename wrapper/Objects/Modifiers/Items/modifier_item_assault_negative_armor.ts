import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_assault_negative_armor extends Modifier {
	// ignored is debuff immunity or magic immunity
	// call Modifier#IsDebuff not needed for checking Modifier#GetSpecialArmorByState
	protected SetBonusArmor(specialName = "aura_negative_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
