import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_snapfire_lil_shredder_debuff extends Modifier {
	protected SetBonusArmor(
		specialName = "armor_reduction_per_attack",
		_subtract = false
	): void {
		const value = this.GetSpecialArmorByState(specialName)
		this.BonusArmor = -(value * Math.max(this.StackCount, 0))
	}
}
