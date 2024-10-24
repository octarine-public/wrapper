import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slithereen_crush extends Modifier {
	public readonly IsDebuff = true

	public SetMoveSpeedAmplifier(
		specialName = "crush_extra_slow",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	protected SetBonusAttackSpeed(
		specialName = "crush_attack_slow_tooltip",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
