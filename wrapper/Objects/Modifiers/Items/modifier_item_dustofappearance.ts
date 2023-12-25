import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dustofappearance extends Modifier {
	protected SetAmplifierMoveSpeed(specialName = "movespeed"): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		this.BonusMoveSpeedAmplifier =
			owner.IsInvisible && !owner.IsUnslowable
				? this.GetSpecialValue(specialName) / 100
				: 0
	}
}
