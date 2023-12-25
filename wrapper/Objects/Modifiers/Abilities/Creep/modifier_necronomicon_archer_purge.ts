import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_necronomicon_archer_purge extends Modifier {
	public readonly IsDebuff = true

	protected SetAmplifierMoveSpeed(_specialName?: string): void {
		if (this.Parent === undefined) {
			return
		}
		this.BonusMoveSpeedAmplifier = !this.Parent.IsUnslowable ? -1 : 0
	}
}
