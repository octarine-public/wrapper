import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bounty_hunter_track extends Modifier {
	private cachedIncDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [this.cachedIncDamage, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedIncDamage = this.GetSpecialValue(
			"target_damage_amp",
			"bounty_hunter_track"
		)
	}
}
