import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_skeleton_king_reincarnate_slow extends Modifier {
	protected SetMoveSpeedAmplifier(
		specialName = "movespeed",
		subtract: boolean = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
