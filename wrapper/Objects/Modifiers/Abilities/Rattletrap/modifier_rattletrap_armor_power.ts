import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rattletrap_armor_power extends Modifier {
	private cachedOutgoingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetDamageOutgoingPercentage.bind(this)
		]
	])

	protected GetDamageOutgoingPercentage(): [number, boolean] {
		const ampDamage = (this.Parent?.Armor ?? 0) * this.cachedOutgoingDamage
		return [ampDamage, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedOutgoingDamage = this.GetSpecialValue(
			"damage_per_armor",
			"rattletrap_armor_power"
		)
	}
}
