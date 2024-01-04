import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_orb_of_corrosion_debuff extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(_specialName?: string, subtract = true): void {
		const caster = this.Caster
		if (caster === undefined) {
			return
		}
		const specialName = `slow${caster.IsRanged ? "_range" : "_melee"}`
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
