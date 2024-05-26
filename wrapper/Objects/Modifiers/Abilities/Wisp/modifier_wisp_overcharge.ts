import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wisp_overcharge extends Modifier {
	public readonly IsBuff = true

	protected SetBonusArmor(specialName = "bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}

	protected SetStatusResistanceSpeed(
		specialName = "shard_bonus_slow_resistance",
		subtract = true
	): void {
		super.SetStatusResistanceSpeed(specialName, subtract)
	}

	protected SetBonusAttackSpeed(
		specialName = "bonus_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
