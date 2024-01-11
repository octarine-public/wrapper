import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kunkka_tidebringer_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "movespeed_slow",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
