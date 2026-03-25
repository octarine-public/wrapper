import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_chasm_stone extends Modifier {
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
		const name = "rubick_arcane_supremacy"
		this.cachedAOERadius = this.GetSpecialValue("aoe_bonus", name)
	}
}
