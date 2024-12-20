import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_seeds_of_serenity_active extends Modifier {
	private cachedHPRegen = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT,
			this.GetHealthRegenConstant.bind(this)
		]
	])

	protected GetHealthRegenConstant(): [number, boolean] {
		return [this.cachedHPRegen, false]
	}

	protected UpdateSpecialValues() {
		this.cachedHPRegen = this.GetSpecialValue(
			"aura_health_regen",
			"item_seeds_of_serenity"
		)
	}
}
