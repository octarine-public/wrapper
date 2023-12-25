import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_boots_of_travel_2 extends Modifier {
	public readonly IsBoots = true

	protected SetBonusMoveSpeed(specialName = "bonus_movement_speed"): void {
		super.SetBonusMoveSpeed(specialName)
	}
}
