import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_shivas_guard extends Modifier {
	private cachedArmor = 0
	private cachedAOERadius = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT,
			this.GetAOEBonusConstant.bind(this)
		]
	])
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}
	protected GetAOEBonusConstant(): [number, boolean] {
		return [this.cachedAOERadius, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_shivas_guard"
		this.cachedArmor = this.GetSpecialValue("bonus_armor", name)
		this.cachedAOERadius = this.GetSpecialValue("bonus_aoe", name)
	}
}
