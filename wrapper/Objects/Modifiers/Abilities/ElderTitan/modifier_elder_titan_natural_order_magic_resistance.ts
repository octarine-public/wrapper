import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_natural_order_magic_resistance
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BASE_REDUCTION,
			this.GetMagicalResistanceBaseReduction.bind(this)
		]
	])

	public IsDebuff(): this is IDebuff {
		return true
	}

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [-this.StackCount, this.IsMagicImmune()]
	}

	protected GetMagicalResistanceBaseReduction(): [number, boolean] {
		return [this.cachedMres, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		this.cachedMres = this.GetSpecialValue(
			"magic_resistance_pct",
			"elder_titan_natural_order_spirit"
		)
	}
}
