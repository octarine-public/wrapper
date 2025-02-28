import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_warcry_barrier extends Modifier {
	public readonly HasVisualShield = true

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
	protected UpdateSpecialValues(): void {
		const name = "sven_warcry"
		this.GetSpecialValue("base_barrier_amount", name) // only debug
		this.GetSpecialValue("barrier_per_strength", name) // only debug
	}
}
