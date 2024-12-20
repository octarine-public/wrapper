import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_diffusal_blade extends Modifier {
	private cachedManaBurn = 0
	private cachedDamagePerBurn = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsMagicImmune || target.IsDebuffImmune) {
			return [0, false]
		}
		if (!target.IsEnemy(this.Parent) || target.IsBuilding || target.MaxMana === 0) {
			return [0, false]
		}
		const multiplier = this.cachedDamagePerBurn
		const damage = Math.min(this.cachedManaBurn, target.Mana) * multiplier
		return [damage, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_diffusal_blade"
		this.cachedManaBurn = this.GetSpecialValue("feedback_mana_burn", name)
		this.cachedDamagePerBurn = this.GetSpecialValue("damage_per_burn", name)
	}
}
