import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_necronomicon_warrior_mana_burn extends Modifier {
	// private cachedManaBurn = 0
	// private cachedManaBurnDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	protected GetPreAttackBonusDamagePercentage(
		params?: IModifierParams
	): [number, boolean] {
		const ability = this.Ability
		if (params === undefined || ability === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.MaxMana === 0) {
			return [0, false]
		}
		if (target.IsMagicImmune || target.IsDebuffImmune) {
			return [0, false]
		}
		// const damage =
		// 	((target.MaxMana * this.cachedManaBurn) / 100) *
		// 	(1 - this.cachedManaBurnDamage / 100)
		return [0, false]
	}

	protected UpdateSpecialValues() {
		// const name = "necronomicon_warrior_mana_burn"
		// this.cachedManaBurn = this.GetSpecialValue("burn_amount", name)
		// this.cachedManaBurnDamage = this.GetSpecialValue("burn_damage_conversion", name)
	}
}
