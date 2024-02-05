import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bloodseeker_bloodrage extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackSpeed(specialName = "attack_speed", subtract = false): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
