import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_snapfire_scatterblast_slow extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(specialName = "attack_slow_pct", subtract = true): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	public SetMoveSpeedAmplifier(
		specialName = "movement_slow_pct",
		subtract = true
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
