import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_furion_curse_of_the_forest extends Modifier {
	public readonly IsDebuff = true

	public SetMoveSpeedAmplifier(_specialName?: string, subtract = true): void {
		const isImmuneSlow = this.ShouldUnslowable()
		if (isImmuneSlow) {
			this.BonusMoveSpeedAmplifier = 0
			return
		}
		const value = this.NetworkDamage
		this.BonusMoveSpeedAmplifier = (subtract ? value * -1 : value) / 100
	}
}
