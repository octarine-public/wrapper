import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_warcry_barrier extends Modifier implements IShield {
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly ShieldModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK_SPECIAL,
			this.GetPhysicalConstantBlockSpecial.bind(this)
		]
	])
	public get StackCount(): number {
		return this.NetworkDamage || super.StackCount
	}
	protected GetPhysicalConstantBlockSpecial(): [number, boolean] {
		return [this.NetworkDamage, false]
	}
}
