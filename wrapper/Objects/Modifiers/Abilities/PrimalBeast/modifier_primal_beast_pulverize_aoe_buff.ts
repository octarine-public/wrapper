import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_pulverize_aoe_buff extends Modifier {
	private cachedAoeRadius = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_PERCENTAGE,
			this.GetAoeBonusPercentage.bind(this)
		]
	])

	protected GetAoeBonusPercentage(): [number, boolean] {
		return [100 + this.cachedAoeRadius * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAoeRadius = this.GetSpecialValue(
			"bonus_aoe_pct_per_hit",
			"primal_beast_pulverize"
		)
	}
}
