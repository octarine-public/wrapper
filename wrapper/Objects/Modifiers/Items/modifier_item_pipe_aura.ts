import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_pipe_aura extends Modifier {
	private cachedMres = 0
	private cachedHPRegen = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT,
			this.GetHealthRegenConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])

	protected GetHealthRegenConstant(): [number, boolean] {
		return [this.cachedHPRegen, false]
	}

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_pipe"
		this.cachedMres = this.GetSpecialValue("magic_resistance_aura", name)
		this.cachedHPRegen = this.GetSpecialValue("aura_health_regen", name)
	}
}
