import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_berserk_potion extends Modifier {
	public readonly IsBuff = true

	protected SetBonusMoveSpeed(specialName = "move_speed", subtract = false): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}

	protected SetBonusAttackSpeed(specialName = "attack_speed", subtract = false): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
