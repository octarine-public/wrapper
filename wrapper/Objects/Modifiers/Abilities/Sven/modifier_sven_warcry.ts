import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_warcry extends Modifier {
	protected SetBonusArmor(specialName = "bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
	public SetMoveSpeedAmplifier(specialName = "movespeed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
