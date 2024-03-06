import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_orb_of_corrosion extends Modifier {
	public readonly BonusAttackSpeedStack = true

	protected SetBonusAttackSpeed(specialName = "attack_speed", subtract = false) {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}