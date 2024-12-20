import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_bloodstone extends Modifier {
	private cachedAOERadius = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT_STACKING,
			this.GetAoeBonusConstantStacking.bind(this)
		]
	])

	protected GetAoeBonusConstantStacking(): [number, boolean] {
		return [this.cachedAOERadius, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAOERadius = this.GetSpecialValue("bonus_aoe", "item_bloodstone")
	}
}
