import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_razor_eye_of_the_storm_armor extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name
	// private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return this.StackCount !== 0
	}
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
