import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_orb_of_destruction_debuff extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(_specialName?: string, subtract = true): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const specialName = `slow_${owner.IsRanged ? "range" : "melee"}`
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
