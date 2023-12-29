import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_wind_lace extends Modifier {
	protected SetBonusMoveSpeed(specialName = "movement_speed", subtract = false): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
