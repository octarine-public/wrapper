import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_jakiro_liquid_fire_burn extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(
		specialName = "slow_attack_speed_pct",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
