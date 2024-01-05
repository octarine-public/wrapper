import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_arcane_boots extends Modifier {
	public readonly IsBoots = true

	protected SetBonusMoveSpeed(specialName = "bonus_movement", subtract = false): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
