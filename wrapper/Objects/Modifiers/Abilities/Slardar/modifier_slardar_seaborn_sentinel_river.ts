import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slardar_seaborn_sentinel_river extends Modifier {
	protected SetBonusArmor(specialName = "puddle_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}

	protected SetStatusResistanceAmplifier(
		specialName = "puddle_status_resistance",
		subtract = false
	): void {
		super.SetStatusResistanceAmplifier(specialName, subtract)
	}
}
