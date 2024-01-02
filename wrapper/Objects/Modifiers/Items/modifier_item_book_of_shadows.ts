import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_book_of_shadows extends Modifier {
	protected SetBonusNightVision(specialName = "night_vision", subtract = false): void {
		super.SetBonusNightVision(specialName, subtract)
	}
}
