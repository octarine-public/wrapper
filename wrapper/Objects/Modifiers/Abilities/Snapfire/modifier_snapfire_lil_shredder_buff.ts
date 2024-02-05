import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_snapfire_lil_shredder_buff extends Modifier {
	public readonly IsBuff = true
	public readonly IsAttackSpeedLimit = false

	protected SetFixedBaseAttackTime(
		specialName = "base_attack_time",
		subtract = false
	): void {
		super.SetFixedBaseAttackTime(specialName, subtract)
	}

	public SetBonusAttackSpeed(
		specialName = "attack_speed_bonus",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
