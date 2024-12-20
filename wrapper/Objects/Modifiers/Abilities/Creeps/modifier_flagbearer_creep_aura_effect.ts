import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_flagbearer_creep_aura_effect extends Modifier {
	private cachedHPRegen = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT,
			this.GetHealthRegenConstant.bind(this)
		]
	])

	protected GetHealthRegenConstant(): [number, boolean] {
		return [this.cachedHPRegen, this.IsPassiveDisabled(this.Caster)]
	}

	protected UpdateSpecialValues(): void {
		this.cachedHPRegen = this.GetSpecialValue(
			"bonus_health_regen",
			"flagbearer_creep_aura_effect"
		)
	}
}
