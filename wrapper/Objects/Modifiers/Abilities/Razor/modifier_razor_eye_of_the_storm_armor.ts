import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_razor_eye_of_the_storm_armor extends Modifier {
	// private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [-this.StackCount, this.IsMagicImmune()]
	}

	// protected UpdateSpecialValues(): void {
	// 	this.cachedArmor = this.GetSpecialValue(
	// 		"armor_reduction",
	// 		"razor_eye_of_the_storm"
	// 	)
	// }
}
