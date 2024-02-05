import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lone_druid_true_form extends Modifier {
	public SetBonusAttackRange(_specialName?: string, _subtract = false): void {
		this.BonusAttackRange = -325 // no special data
	}
}
