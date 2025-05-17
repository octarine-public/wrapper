import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_spirit_breaker_greater_bash extends Modifier {
	private multiplierSpeed = 0

	public GetRawDamage(_target: Unit): number {
		return ((this.Parent?.MoveSpeed ?? 0) * this.multiplierSpeed) / 100
	}

	protected UpdateSpecialValues(): void {
		this.multiplierSpeed = this.GetSpecialValue(
			"damage",
			"spirit_breaker_greater_bash"
		)
	}
}
