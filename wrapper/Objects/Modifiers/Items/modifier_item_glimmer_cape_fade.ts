import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_glimmer_cape_fade extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK,
			this.GetMagicalConstantBlock.bind(this)
		]
	])
	public get StackCount(): number {
		return this.NetworkArmor || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	public IsShield(): this is IShield {
		return this.StackCount !== 0
	}
	private GetMagicalConstantBlock(): [number, boolean] {
		return [this.NetworkArmor, false]
	}
}
