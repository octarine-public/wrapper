import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_coat_of_blood extends Modifier {
	// inite (axe_coat_of_blood) bonus armor
	protected SetBonusArmor(_specialName?: string, _subtract = false): void {
		this.BonusArmor = this.StackCount
	}
}
