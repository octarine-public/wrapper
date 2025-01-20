import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lion_finger_of_death_kill_counter
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedBonusDamagePerStack = 0

	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
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
