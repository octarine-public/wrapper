import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_phoenix_fire_spirit_burn extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(specialName = "attackspeed_slow", subtract = false): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
