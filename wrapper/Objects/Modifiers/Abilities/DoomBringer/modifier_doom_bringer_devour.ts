import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_doom_bringer_devour extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}
	protected UpdateSpecialValues() {
		this.cachedMres = this.GetSpecialValue("magic_resist", "doom_bringer_devour")
	}
}
