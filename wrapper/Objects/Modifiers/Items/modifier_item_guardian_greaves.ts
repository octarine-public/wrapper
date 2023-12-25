import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_guardian_greaves extends Modifier {
	public readonly IsBoots = true

	protected SetBonusMoveSpeed(specialName = "bonus_movement"): void {
		super.SetBonusMoveSpeed(specialName)
	}
}
