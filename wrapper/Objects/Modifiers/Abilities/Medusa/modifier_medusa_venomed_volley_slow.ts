import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_medusa_venomed_volley_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetBonusAttackSpeed(specialName = "attack_slow", subtract = true): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected SetBonusCastPointAmplifier(
		specialName = "cast_slow",
		subtract = true
	): void {
		super.SetBonusCastPointAmplifier(specialName, subtract)
	}
}
