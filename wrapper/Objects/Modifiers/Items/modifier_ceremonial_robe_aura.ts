import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ceremonial_robe_aura extends Modifier {
	private cachedMres = 0
	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [-this.cachedMres, this.IsMagicImmune()]
	}

	protected GetStatusResistanceStacking(): [number, boolean] {
		return [-this.cachedStatusResist, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "item_ceremonial_robe"
		this.cachedMres = this.GetSpecialValue("magic_resistance", name)
		this.cachedStatusResist = this.GetSpecialValue("status_resistance", name)
	}
}
