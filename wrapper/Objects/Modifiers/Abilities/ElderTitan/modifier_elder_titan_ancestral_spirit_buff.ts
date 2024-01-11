import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_ancestral_spirit_buff extends Modifier {
	public readonly IsBuff = true

	protected SetMoveSpeedAmplifier(_specialName?: string, _subtract = false): void {
		this.BonusMoveSpeedAmplifier = this.NetworkChannelTime / 100
	}
}
