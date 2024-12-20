import { ModifierParams } from "../../../Base/ModifierParams"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager, Unit } from "../../../Imports"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_blight_stone extends Modifier {
	private cachedPreArmor = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_PREATTACK_BONUS_TARGET,
			this.GetPhysicalArmorPreAttackBonusTarget.bind(this)
		]
	])

	protected GetPhysicalArmorPreAttackBonusTarget(
		modifierParams?: ModifierParams
	): [number, boolean] {
		if (modifierParams === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(modifierParams.TargetIndex)
		if (target === undefined || target.HasBuffByName("modifier_blight_stone_buff")) {
			return [0, false]
		}
		return [this.cachedPreArmor, false]
	}

	protected UpdateSpecialValues() {
		this.cachedPreArmor = this.GetSpecialValue(
			"corruption_armor",
			"item_blight_stone"
		)
	}
}
