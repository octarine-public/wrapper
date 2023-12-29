import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_pirate_hat extends Modifier {
	protected SetBonusMoveSpeed(specialName = "bonus_ms", subtract = false): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
