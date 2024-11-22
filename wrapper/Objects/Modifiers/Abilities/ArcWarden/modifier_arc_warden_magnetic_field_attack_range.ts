import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_arc_warden_magnetic_field_attack_range extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	private cachedRange = 0

	protected GetAttackRangeBonus(): [number, boolean] {
		return [(this.Parent?.IsRanged ?? false) ? this.cachedRange : 0, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue(
			"attack_range_bonus",
			"arc_warden_magnetic_field"
		)
	}
}
