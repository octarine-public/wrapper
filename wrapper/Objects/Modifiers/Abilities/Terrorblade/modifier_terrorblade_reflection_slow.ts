import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_terrorblade_reflection_slow extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(specialName = "attack_slow", subtract = true): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
