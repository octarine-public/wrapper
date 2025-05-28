import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_divine_regalia extends Modifier {
	private cachedBonusDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetDamageOutgoingPercentage.bind(this)
		]
	])
	protected GetDamageOutgoingPercentage(): [number, boolean] {
		return [this.cachedBonusDamage, false]
	}
	protected UpdateSpecialValues() {
		this.cachedBonusDamage = this.GetSpecialValue(
			"outgoing_damage",
			"item_divine_regalia"
		)
	}
}
