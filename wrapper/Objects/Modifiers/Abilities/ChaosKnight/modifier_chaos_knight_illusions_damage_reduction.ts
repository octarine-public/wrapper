import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_chaos_knight_illusions_damage_reduction extends Modifier {
	private cachedIncomingReductionDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	protected GetIncomingDamagePercentage(_params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || !owner.IsIllusion) {
			return [0, false]
		}
		return [-this.cachedIncomingReductionDamage, false]
	}

	protected UpdateSpecialValues() {
		this.cachedIncomingReductionDamage = this.GetSpecialValue(
			"damage_reduction_pct",
			"chaos_knight_phantasmagoria"
		)
	}
}
