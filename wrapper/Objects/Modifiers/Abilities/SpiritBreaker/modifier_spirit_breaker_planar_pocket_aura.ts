import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spirit_breaker_planar_pocket_aura
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return this.Caster === this.Parent ? [this.cachedMres, false] : [0, false]
	}
	protected UpdateSpecialValues() {
		this.cachedMres = this.GetSpecialValue(
			"magic_resistance",
			"spirit_breaker_planar_pocket"
		)
	}
}
