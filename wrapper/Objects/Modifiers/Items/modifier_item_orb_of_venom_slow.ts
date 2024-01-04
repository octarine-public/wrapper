import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_orb_of_venom_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(_specialName?: string, subtract = false): void {
		const caster = this.Caster
		if (caster === undefined) {
			return
		}
		const specialName = `poison_movement_speed${
			caster.IsRanged ? "_range" : "_melee"
		}`
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
