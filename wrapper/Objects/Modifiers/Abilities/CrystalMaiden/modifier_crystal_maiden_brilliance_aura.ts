import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_crystal_maiden_brilliance_aura extends Modifier {
	protected SetBonusAOERadiusAmplifier(
		specialName = this.Parent === this.Caster ? "aoe_bonus" : undefined,
		subtract = false
	): void {
		super.SetBonusAOERadiusAmplifier(specialName, subtract)
	}

	protected SetBonusCastRange(
		specialName = this.Parent === this.Caster ? "self_cast_range_bonus" : undefined,
		subtract = false
	): void {
		super.SetBonusCastRange(specialName, subtract)
	}
}
