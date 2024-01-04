import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_necronomicon_archer_purge extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(_specialName?: string, _subtract?: boolean): void {
		const state = this.ShouldUnslowable()
		// HARDCODED: no special value data
		this.BonusMoveSpeedAmplifier = !state ? -1 : 0
	}
}
