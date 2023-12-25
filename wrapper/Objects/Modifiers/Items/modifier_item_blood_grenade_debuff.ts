import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_blood_grenade_debuff extends Modifier {
	protected SetAmplifierMoveSpeed(specialName = "movespeed_slow"): void {
		if (this.Parent === undefined) {
			return
		}
		this.BonusMoveSpeedAmplifier = !this.Parent.IsUnslowable
			? this.GetSpecialValue(specialName) / 100
			: 0
	}
}
