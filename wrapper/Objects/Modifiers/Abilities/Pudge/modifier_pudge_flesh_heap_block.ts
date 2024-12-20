import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pudge_flesh_heap_block extends Modifier {
	private cachedShield = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])

	protected GetTotalConstantBlock(): [number, boolean] {
		return [this.cachedShield, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedShield = this.GetSpecialValue("damage_block", "pudge_flesh_heap")
	}
}
