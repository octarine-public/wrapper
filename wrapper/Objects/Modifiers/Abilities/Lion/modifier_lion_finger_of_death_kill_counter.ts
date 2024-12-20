import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lion_finger_of_death_kill_counter extends Modifier {
	private cachedBonusDamagePerStack = 0

	public GetSpellBonusDamage(rawDamage: number): number {
		return rawDamage + this.cachedBonusDamagePerStack * this.StackCount
	}

	protected UpdateSpecialValues(): void {
		this.cachedBonusDamagePerStack = this.GetSpecialValue(
			"damage_per_kill",
			"lion_finger_of_death"
		)
	}
}
