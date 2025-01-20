import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_bristleback_quill_spray extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedBonusDamage = 0

	public GetBonusDamagePerStack(_target: Unit): number {
		return this.cachedBonusDamage * this.StackCount
	}

	public IsDebuff(): this is IDebuff {
		return true
	}

	protected UpdateSpecialValues(): void {
		this.cachedBonusDamage = this.GetSpecialValue(
			"quill_stack_damage",
			"bristleback_quill_spray"
		)
	}
}
