import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_skeleton_king_hellfire_blast extends Modifier {
	protected SetMoveSpeedAmplifier(specialName = "blast_slow"): void {
		if (this.Parent !== undefined && !this.Parent.IsUnslowable) {
			super.SetMoveSpeedAmplifier(specialName)
		}
	}
}
