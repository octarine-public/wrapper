import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dezun_bloodrite extends Modifier {
	private cachedAoeRadius = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_PERCENTAGE,
			this.GetAoeBonusPercentage.bind(this)
		]
	])

	protected GetAoeBonusPercentage(): [number, boolean] {
		return [100 + this.cachedAoeRadius, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAoeRadius = this.GetSpecialValue("aoe_pct", "item_dezun_bloodrite")
	}
}
