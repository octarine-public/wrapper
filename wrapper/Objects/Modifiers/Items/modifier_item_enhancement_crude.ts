import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_crude extends Modifier {
	private cachedBAT = 0
	private cachedSlowResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_PERCENTAGE,
			this.GetBaseAttackTimePercentage.bind(this)
		]
	])
	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSlowResist, false]
	}
	protected GetBaseAttackTimePercentage(): [number, boolean] {
		return [-this.cachedBAT, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_enhancement_crude"
		this.cachedBAT = this.GetSpecialValue("bat_reduce", name)
		this.cachedSlowResist = this.GetSpecialValue("slow_resistance", name)
	}
}
