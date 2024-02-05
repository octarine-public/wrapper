import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ursa_overpower extends Modifier {
	public readonly IsBuff = true

	public SetBonusAttackSpeed(
		specialName = "attack_speed_bonus_pct",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
