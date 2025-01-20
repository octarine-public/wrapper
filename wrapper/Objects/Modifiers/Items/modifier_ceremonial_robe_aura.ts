import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ceremonial_robe_aura extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

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
	public IsDebuff(): this is IDebuff {
		return true
	}
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
