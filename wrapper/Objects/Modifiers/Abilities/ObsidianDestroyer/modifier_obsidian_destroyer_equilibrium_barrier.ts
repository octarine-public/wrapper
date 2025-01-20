import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_obsidian_destroyer_equilibrium_barrier
	extends Modifier
	implements IBuff, IShield
{
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])
	public get StackCount(): number {
		return this.NetworkFadeTime - this.NetworkArmor || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return this.StackCount !== 0
	}
	protected GetTotalConstantBlock(): [number, boolean] {
		return [this.NetworkFadeTime - this.NetworkArmor, false]
	}
}
