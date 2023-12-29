import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dandelion_amulet extends Modifier {
	protected SetBonusMoveSpeed(specialName = "move_speed", subtract = false): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
