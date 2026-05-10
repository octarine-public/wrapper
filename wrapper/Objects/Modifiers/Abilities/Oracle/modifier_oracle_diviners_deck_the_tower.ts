import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_oracle_diviners_deck_the_tower
	extends Modifier
	implements IBuff, IShield
{
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedBlock = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])
	public get StackCount(): number {
		return Math.max(this.cachedBlock - this.NetworkArmor, 0) || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetTotalConstantBlock(): [number, boolean] {
		return [Math.max(this.cachedBlock - this.NetworkArmor, 0), false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedBlock = this.GetSpecialValue("barrier_amount", "oracle_diviners_deck")
	}
}
