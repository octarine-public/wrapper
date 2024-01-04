import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_bloodstone extends Modifier {
	protected SetBonusAOERadius(specialName = "bonus_aoe", subtract = false) {
		super.SetBonusAOERadius(specialName, subtract)
	}
}
