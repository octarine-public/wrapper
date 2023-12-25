import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spirit_breaker_bulldoze extends Modifier {
	protected SetAmplifierMoveSpeed(specialName = "movement_speed"): void {
		super.SetAmplifierMoveSpeed(specialName)
	}
}
