import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_desolator_buff extends Modifier {
	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		this.cachedArmor = this.GetSpecialValue("corruption_armor", "item_desolator")
	}
}
