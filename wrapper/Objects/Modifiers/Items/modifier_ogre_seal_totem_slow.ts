import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ogre_seal_totem_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(specialName = "slow", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
