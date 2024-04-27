import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shredder_reactive_armor extends Modifier {
	protected SetBonusArmor(specialName = "bonus_armor", _subtract = false): void {
		const value = this.GetSpecialArmorByState(specialName)
		this.BonusArmor = value * Math.max(this.StackCount, 0)
	}
}
