import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_witches_switch_aura_effect extends Modifier {
	private cachedArmor = 0
	private cachedHPRegen = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT,
			this.GetHealthRegenConstant.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}

	protected GetHealthRegenConstant(): [number, boolean] {
		return [this.cachedHPRegen, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_witches_switch"
		this.cachedArmor = this.GetSpecialValue("aura_armor", name)
		this.cachedHPRegen = this.GetSpecialValue("aura_health_regen", name)
	}
}
