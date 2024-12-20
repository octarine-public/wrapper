import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_nemesis_curse_debuff extends Modifier {
	private cachedIncDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [this.cachedIncDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedIncDamage = this.GetSpecialValue("debuff_enemy", "item_nemesis_curse")
	}
}
