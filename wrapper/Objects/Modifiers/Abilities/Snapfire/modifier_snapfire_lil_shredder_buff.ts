import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_snapfire_lil_shredder_buff extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackRange(
		specialName = "attack_range_bonus",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
