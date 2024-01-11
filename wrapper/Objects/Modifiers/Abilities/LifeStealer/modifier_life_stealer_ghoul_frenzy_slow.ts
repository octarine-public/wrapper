import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_life_stealer_ghoul_frenzy_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "movement_slow",
		subtract = true
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
