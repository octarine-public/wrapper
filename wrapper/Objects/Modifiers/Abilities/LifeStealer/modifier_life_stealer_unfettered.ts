import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_life_stealer_unfettered extends Modifier implements IBuff {
	public readonly BuffModifierName = this.Name

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
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}
	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedStatusResist, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "life_stealer_unfettered"
		this.cachedMres = this.GetSpecialValue("magic_resist", name)
		this.cachedStatusResist = this.GetSpecialValue("status_resist", name)
	}
}
