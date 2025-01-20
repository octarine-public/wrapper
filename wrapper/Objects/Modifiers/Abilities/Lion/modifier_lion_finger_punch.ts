import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lion_finger_punch extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAX_ATTACK_RANGE,
			this.GetMaxAttackRange.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMaxAttackRange(): [number, boolean] {
		return [this.cachedRange, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue(
			"punch_attack_range",
			"lion_finger_of_death"
		)
	}
}
