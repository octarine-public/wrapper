import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_culling_blade_boost extends Modifier {
	public readonly IsBuff = true

	protected SetBonusArmor(specialName = "armor_bonus", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}

	public SetMoveSpeedAmplifier(specialName = "speed_bonus", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
