import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hoodwink_scurry_active extends Modifier {
	public readonly IsBuff = true

	protected SetBonusCastRange(specialName = "cast_range", subtract = false) {
		super.SetBonusCastRange(specialName, subtract)
	}

	protected SetBonusAttackRange(specialName = "attack_range", subtract = false): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
