import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_skadi_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(_specialName?: string, subtract = false): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const specialName = `cold_slow${owner.IsRanged ? "_ranged" : "_melee"}`
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	protected SetAttackSpeedAmplifier(_specialName?: string, subtract = false) {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const specialName = `cold_attack_slow${owner.IsRanged ? "_ranged" : "_melee"}`
		super.SetAttackSpeedAmplifier(specialName, subtract)
	}
}
