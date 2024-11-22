import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shadow_shaman_serpent_ward extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GeAttackRangeBonus.bind(this)
		]
	])

	private cachedRange = 0

	protected GeAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue(
			"bonus_attack_range",
			"shadow_shaman_mass_serpent_ward"
		)
	}
}
