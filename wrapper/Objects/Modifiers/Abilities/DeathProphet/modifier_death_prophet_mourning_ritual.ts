import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_death_prophet_mourning_ritual extends Modifier {
	private cachedIncomingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [-this.cachedIncomingDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedIncomingDamage = this.GetSpecialValue(
			"delay_pct",
			"death_prophet_mourning_ritual"
		)
	}
}
