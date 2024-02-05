import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_duelist_gloves extends Modifier {
	protected SetBonusAttackSpeed(_specialName?: string, _subtract = false) {
		this.BonusAttackSpeed = this.NetworkDamage
	}
}
