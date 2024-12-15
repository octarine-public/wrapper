import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_eternal_shroud extends Modifier {
	private cachedMres = 0
	private cachedBonusMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres + this.cachedBonusMres * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "item_eternal_shroud"
		this.cachedMres = this.GetSpecialValue("bonus_spell_resist", name)
		this.cachedBonusMres = this.GetSpecialValue("stack_resist", name)
	}
}
