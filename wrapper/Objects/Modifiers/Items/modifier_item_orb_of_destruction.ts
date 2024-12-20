import { ModifierParams } from "../../../Base/ModifierParams"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_orb_of_destruction extends Modifier {
	private cachedArmor = 0

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
		const name = "modifier_orb_of_destruction_debuff"
		const target = EntityManager.EntityByIndex<Unit>(modifierParams.TargetIndex)
		if (target === undefined || target.HasBuffByName(name)) {
			return [0, false]
		}
		return [-this.cachedArmor, target.IsMagicImmune || target.IsDebuffImmune]
	}

	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue(
			"armor_reduction",
			"item_orb_of_destruction"
		)
	}
}
