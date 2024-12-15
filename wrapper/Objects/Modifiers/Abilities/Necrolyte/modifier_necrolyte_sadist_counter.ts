import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_necrolyte_sadist_counter extends Modifier {
	private cachedAoeRadius = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT_STACKING,
			this.GetAoeBonusConstantStacking.bind(this)
		]
	])

	protected GetAoeBonusConstantStacking(): [number, boolean] {
		return [this.cachedAoeRadius * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAoeRadius = this.GetSpecialValue("bonus_aoe", "necrolyte_sadist")
	}
}
