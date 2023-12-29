import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_overwhelming_blink_debuff extends Modifier {
	public readonly IsDebuff = true

	protected SetAmplifierMoveSpeed(
		specialName = "movement_slow",
		subtract = true
	): void {
		super.SetAmplifierMoveSpeed(specialName, subtract)
	}
}
