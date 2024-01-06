import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pudge_rot extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(specialName = "rot_slow", subtract = false): void {
		if (this.Parent !== this.Caster) {
			super.SetMoveSpeedAmplifier(specialName, subtract)
		}
	}
}
