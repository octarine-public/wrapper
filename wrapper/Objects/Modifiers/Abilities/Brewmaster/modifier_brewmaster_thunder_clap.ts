import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_brewmaster_thunder_clap extends Modifier {
	public readonly IsDebuff = true

	protected SetBonusAttackSpeed(
		specialName = "attack_speed_slow",
		subtract = true
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected SetMoveSpeedAmplifier(
		specialName = "movement_slow",
		subtract = true
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
