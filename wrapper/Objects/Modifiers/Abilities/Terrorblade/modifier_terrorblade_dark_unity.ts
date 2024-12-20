import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_terrorblade_dark_unity extends Modifier {
	private cachedInSideDamage = 0
	private cachedOutSideDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetOutgoingDamagePercentage.bind(this)
		]
	])

	protected GetOutgoingDamagePercentage(): [number, boolean] {
		const value = this.NetworkIsActive
			? this.cachedInSideDamage
			: this.cachedOutSideDamage
		return [value, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "terrorblade_dark_unity"
		this.cachedInSideDamage = this.GetSpecialValue(
			"inside_radius_bonus_damage_pct",
			name
		)
		this.cachedOutSideDamage = this.GetSpecialValue(
			"outside_radius_bonus_damage_pct",
			name
		)
	}
}
