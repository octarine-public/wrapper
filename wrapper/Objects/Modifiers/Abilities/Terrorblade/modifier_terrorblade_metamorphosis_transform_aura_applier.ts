import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_terrorblade_metamorphosis_transform_aura_applier
	extends Modifier
	implements IBuff
{
	public readonly BuffModifierName = this.Name

	private cachedRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetAttackRangeBonus(): [number, boolean] {
		// e.g rubick
		return this.Ability?.IsStolen ? [0, false] : [this.cachedRange, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue(
			"bonus_range",
			"terrorblade_metamorphosis"
		)
	}
}
