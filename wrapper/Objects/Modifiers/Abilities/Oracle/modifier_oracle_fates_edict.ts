import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_oracle_fates_edict
	extends Modifier
	implements IDebuff, IBuff, IDisable, IShield
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return !this.IsDebuff()
	}
	public IsDisable(): this is IDisable {
		return this.IsDebuff()
	}
	public IsShield(): this is IShield {
		return !this.IsDebuff()
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		return owner.IsEnemy(caster) ? [0, false] : [this.cachedMres, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue(
			"magic_damage_resistance_pct_tooltip",
			"oracle_fates_edict"
		)
	}
}
