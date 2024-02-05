import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_abaddon_frostmourne_debuff_bonus extends Modifier {
	public readonly IsDebuff = true
	// TODO: calculate shard
	// protected SetMoveSpeedAmplifier(specialName = "curse_slow", subtract = true): void {
	// 	super.SetMoveSpeedAmplifier(specialName, subtract)
	// }
}
