import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_hurricane_pike_range extends Modifier {
	public SetBonusAttackRange(_specialName?: string, _subtract = false): void {
		this.IsInfinityAttackRange = this.IsRanged
	}
}
