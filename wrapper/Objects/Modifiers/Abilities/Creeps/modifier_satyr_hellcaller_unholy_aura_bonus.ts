import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_satyr_hellcaller_unholy_aura_bonus extends Modifier {
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
			"health_regen",
			"satyr_hellcaller_unholy_aura"
		)
	}
}
