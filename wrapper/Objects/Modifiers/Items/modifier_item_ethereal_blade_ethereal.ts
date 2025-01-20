import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ethereal_blade_ethereal
	extends Modifier
	implements IBuff, IDebuff, IShield
{
	public readonly IsGhost = true
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
			this.GetMagicalResistanceDecrepifyUnique.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return !this.IsDebuff()
	}
	public IsShield(): this is IShield {
		return !this.IsDebuff()
	}
	protected GetMagicalResistanceDecrepifyUnique(): [number, boolean] {
		return [this.cachedMres, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue(
			"ethereal_damage_bonus",
			"item_ethereal_blade"
		)
	}
}
