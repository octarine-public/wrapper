import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_grove_bow_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [-this.cachedMres, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue(
			"magic_resistance_reduction",
			"item_grove_bow"
		)
	}
}
