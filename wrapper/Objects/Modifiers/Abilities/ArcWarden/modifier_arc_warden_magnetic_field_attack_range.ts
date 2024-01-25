import { WrapperClassModifier } from "../../../../Decorators"
import { Team } from "../../../../Enums/Team"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_arc_warden_magnetic_field_attack_range extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackRange(
		specialName = "attack_range_bonus",
		subtract?: boolean
	): void {
		if (this.Parent?.Team === Team.Dire) {
			super.SetBonusAttackRange(specialName, subtract)
		}
	}
}
