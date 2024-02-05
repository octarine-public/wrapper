import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_arc_warden_magnetic_field_attack_speed extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackSpeed(
		specialName = "attack_speed_bonus",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
