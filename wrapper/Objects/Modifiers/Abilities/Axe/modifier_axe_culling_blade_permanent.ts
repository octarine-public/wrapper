import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_culling_blade_permanent extends Modifier {
	protected SetBonusArmor(specialName = "armor_per_stack", _subtract = false): void {
		// no limit armor per stack
		this.BonusArmor = this.GetSpecialValue(specialName) * this.StackCount
	}
}
