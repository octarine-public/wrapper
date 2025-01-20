import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_templar_assassin_refraction_absorb
	extends Modifier
	implements IBuff, IShield
{
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedShield = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AVOID_DAMAGE,
			this.GetAvoidDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetAvoidDamage(): [number, boolean] {
		return [this.StackCount !== 0 ? 1 : 0, false]
	}
	protected GetTotalConstantBlock(): [number, boolean] {
		const value = this.cachedShield * this.StackCount
		return [value - this.NetworkDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedShield = this.GetSpecialValue(
			"shield_per_instance",
			"templar_assassin_refraction"
		)
	}
}
