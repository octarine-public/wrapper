import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spectre_dispersion_boost
	extends Modifier
	implements IBuff, IShield
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	public CachedDamageReflection = 0

	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected UpdateSpecialValues(): void {
		this.CachedDamageReflection = this.GetSpecialValue(
			"activation_bonus_pct",
			"spectre_dispersion"
		)
	}
}
