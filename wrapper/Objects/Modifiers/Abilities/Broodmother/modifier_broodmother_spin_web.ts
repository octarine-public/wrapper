import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_broodmother_spin_web extends Modifier {
	public readonly IsBuff = true

	protected SetBonusTurnRate(specialName = "bonus_turn_rate", subtract = false): void {
		super.SetBonusTurnRate(specialName, subtract)
	}
}
