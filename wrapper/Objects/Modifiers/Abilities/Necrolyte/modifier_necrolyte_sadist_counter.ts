import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_necrolyte_sadist_counter extends Modifier {
	protected SetBonusAOERadius(specialName = "bonus_aoe", _subtract = false) {
		const value = this.GetSpecialValue(specialName)
		const stackCount = Math.max(this.StackCount, 0)
		this.BonusAOERadius = value * stackCount
	}
}
