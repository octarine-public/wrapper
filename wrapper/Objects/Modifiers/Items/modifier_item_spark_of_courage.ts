import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_spark_of_courage extends Modifier {
	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		const hpPercent = this.Parent?.HPPercent ?? 0
		return [hpPercent <= 50 ? this.cachedArmor : 0, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("armor", "item_spark_of_courage")
	}
}
