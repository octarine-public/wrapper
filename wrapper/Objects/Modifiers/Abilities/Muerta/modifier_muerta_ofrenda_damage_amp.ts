import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_muerta_ofrenda_damage_amp extends Modifier {
	public SetBonusAttackSpeed(
		specialName = "attackspeed_bonus",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
