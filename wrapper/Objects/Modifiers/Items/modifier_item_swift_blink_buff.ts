import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_swift_blink_buff extends Modifier {
	protected SetAmplifierMoveSpeed(specialName = "bonus_movement"): void {
		super.SetAmplifierMoveSpeed(specialName)
	}
}
