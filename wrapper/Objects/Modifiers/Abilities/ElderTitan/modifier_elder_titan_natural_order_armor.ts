import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_natural_order_armor extends Modifier {
	private cachedArmorBase = 0
	private cachedMaxStackCount = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE,
			this.GetPhysicalArmorBasePercentage.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return this.cachedMaxStackCount !== 0
			? [-(this.StackCount + 1), this.IsMagicImmune()]
			: [0, false]
	}

	protected GetPhysicalArmorBasePercentage(): [number, boolean] {
		return [100 - this.cachedArmorBase, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "elder_titan_natural_order"
		this.cachedMaxStackCount = this.GetSpecialValue("max_stacks", name)
		this.cachedArmorBase = this.GetSpecialValue("armor_reduction_pct", name)
	}
}
