import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_frogmen_water_bubble extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedDamageBlock = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK,
			this.GetMagicalConstantBlock.bind(this)
		]
	])
	public get StackCount(): number {
		return this.damageBlock || super.StackCount
	}
	private get damageBlock() {
		return this.cachedDamageBlock - this.NetworkDamage
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetMagicalConstantBlock(): [number, boolean] {
		return [this.damageBlock, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamageBlock = this.GetSpecialValue(
			"damage_absorb",
			"frogmen_water_bubble_small"
		)
	}
}
