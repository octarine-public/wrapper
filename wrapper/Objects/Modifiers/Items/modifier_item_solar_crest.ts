import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_solar_crest extends Modifier {
	public readonly IsBuff = true

	protected SetBonusMoveSpeed(
		specialName = "self_movement_speed",
		subtract = false
	): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
