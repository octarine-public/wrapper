import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_big_thunder_lizard_frenzy extends Modifier {
	public readonly IsBuff = true

	public SetBonusAttackSpeed(
		specialName = "attackspeed_bonus",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
