import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wisp_equilibrium extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetDamageOutgoingPercentage.bind(this)
		]
	])
	protected GetDamageOutgoingPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		return [owner.HPPercentDecimal * this.cachedDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"damage_amplification",
			"wisp_equilibrium",
			this.AbilityLevel,
			{ lvlup: { operation: EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD } }
		)
	}
}
