import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_havoc_hammer_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetAmplifierMoveSpeed(specialName = "slow"): void {
		if (this.Parent === undefined) {
			return
		}
		this.BonusMoveSpeedAmplifier = !this.Parent.IsUnslowable
			? -this.GetSpecialValue(specialName) / 100
			: 0
	}
}
