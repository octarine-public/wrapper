import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_force_boots extends Modifier {
	public readonly IsBoots = true

	protected SetBonusMoveSpeed(specialName = "bonus_movement_speed"): void {
		super.SetBonusMoveSpeed(specialName)
	}
}
