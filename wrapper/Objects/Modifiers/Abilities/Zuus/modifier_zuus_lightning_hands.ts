import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_zuus_lightning_hands extends Modifier {
	public readonly IsBuff = true

	public SetBonusAttackSpeed(
		specialName = "attack_speed_bonus",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
