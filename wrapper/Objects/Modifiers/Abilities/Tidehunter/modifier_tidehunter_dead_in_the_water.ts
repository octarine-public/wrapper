import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tidehunter_dead_in_the_water extends Modifier {
	public readonly IsDebuff = true

	public SetFixedMoveSpeed(_specialName?: string, _subtract?: boolean): void {
		const isImmuneSlow = this.ShouldUnslowable()
		this.MoveSpeedFixed = isImmuneSlow ? 0 : this.NetworkArmor
	}
}
