import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_pulverize_aoe_buff extends Modifier {
	protected SetBonusAOERadiusAmplifier(
		specialName = "bonus_aoe_pct_per_hit",
		subtract = false
	) {
		const value = this.GetSpecialValue(specialName) * this.StackCount
		this.BonusAOERadiusAmplifier = (subtract ? value * -1 : value) / 100
	}
}
