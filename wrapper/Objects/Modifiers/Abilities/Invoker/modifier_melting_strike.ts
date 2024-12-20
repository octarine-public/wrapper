import { ModifierParams } from "../../../../Base/ModifierParams"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_melting_strike extends Modifier {
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
		if (target === undefined) {
			return [0, false]
		}
		return [-this.cachedPreArmor, target.IsMagicImmune || target.IsDebuffImmune]
	}

	protected UpdateSpecialValues(): void {
		this.cachedPreArmor = this.GetSpecialValue(
			"armor_removed",
			"forged_spirit_melting_strike"
		)
	}
}
