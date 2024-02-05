import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_big_thunder_lizard_wardrums_aura extends Modifier {
	public readonly IsBuff = true

	public SetBonusAttackSpeed(specialName = "speed_bonus", subtract = false): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
