import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_corrosive_breath_dot extends Modifier {
	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [-this.cachedArmor, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue(
			"corrosive_breath_armor_reduction",
			"dragon_knight_dragon_blood"
		)
	}
}
