import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_safety_bubble extends Modifier {
	public readonly HasVisualShield = true

	private cachedShield = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])

	protected GetTotalConstantBlock(): [number, boolean] {
		return [this.cachedShield - this.NetworkArmor, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedShield = this.GetSpecialValue("shield", "item_safety_bubble")
	}
}
