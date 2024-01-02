import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_diffusal_blade_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(_specialName?: string, _subtract?: boolean): void {
		const state = this.ShouldUnslowable()
		// HARDCODED: no special value data (100% slow)
		this.BonusMoveSpeedAmplifier = !state ? -1 : 0
	}
}
