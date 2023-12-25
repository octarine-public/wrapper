import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_elven_tunic extends Modifier {
	protected SetAmplifierMoveSpeed(specialName = "movment") {
		super.SetAmplifierMoveSpeed(specialName)
	}
}
