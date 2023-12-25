import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_orb_of_destruction_debuff extends Modifier {
	public readonly IsDebuff = true

	protected SetAmplifierMoveSpeed(
		specialName = this.Caster?.IsRanged ? "slow_range" : "slow_melee"
	): void {
		if (this.Parent === undefined) {
			return
		}
		this.BonusMoveSpeedAmplifier = !this.Parent.IsUnslowable
			? -this.GetSpecialValue(specialName) / 100
			: 0
	}
}
