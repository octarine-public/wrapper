import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ogre_seal_totem_slow extends Modifier {
	protected SetAmplifierMoveSpeed(specialName = "slow"): void {
		if (this.Parent === undefined) {
			return
		}
		this.BonusMoveSpeedAmplifier = !this.Parent.IsUnslowable
			? this.GetSpecialValue(specialName) / 100
			: 0
	}
}
