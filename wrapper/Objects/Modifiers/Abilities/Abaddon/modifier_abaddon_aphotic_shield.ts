import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_abaddon_aphotic_shield extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedShield = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])
	public get StackCount(): number {
		return this.cachedShield - this.NetworkDamage || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetTotalConstantBlock(): [number, boolean] {
		return [this.cachedShield - this.NetworkDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedShield = this.GetSpecialValue(
			"damage_absorb",
			"abaddon_aphotic_shield"
		)
	}
}
