import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_blood_grenade_debuff extends Modifier {
	public readonly IsDebuff = true

	protected SetAmplifierMoveSpeed(
		specialName = "movespeed_slow",
		subtract = false
	): void {
		super.SetAmplifierMoveSpeed(specialName, subtract)
	}
}
