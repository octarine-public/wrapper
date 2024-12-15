import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_force_field extends Modifier {
	private cachedMres = 0
	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_force_field"
		this.cachedMres = this.GetSpecialValue("self_mres", name)
		this.cachedArmor = this.GetSpecialValue("self_armor", name)
	}
}
