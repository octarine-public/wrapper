import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_glimmer_cape extends Modifier {
	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue("bonus_magical_armor", "item_glimmer_cape")
	}
}
