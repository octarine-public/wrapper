import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_razor_eye_of_the_storm_armor extends Modifier {
	protected SetBonusArmor(specialName = "armor_reduction", _subtract = true): void {
		const value = this.GetSpecialArmorByState(specialName)
		this.BonusArmor = -(value * Math.max(this.StackCount, 0))
	}
}
