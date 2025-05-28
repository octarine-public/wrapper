import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_crude extends Modifier {
	private cachedBAT = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_PERCENTAGE,
			this.GetBaseAttackTimePercentage.bind(this)
		]
	])

	protected GetBaseAttackTimePercentage(): [number, boolean] {
		return [-this.cachedBAT, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedBAT = this.GetSpecialValue("bat_reduce", "item_enhancement_crude")
	}
}
