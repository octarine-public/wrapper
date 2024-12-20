import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_quelling_blade extends Modifier {
	private cachedDamageMelee = 0
	private cachedDamageRanged = 0

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
		if (target === undefined || target.IsHero) {
			return [0, false]
		}
		if (!target.IsEnemy(this.Parent) || target.IsBuilding) {
			return [0, false]
		}
		return [
			this.HasMeleeAttacksBonuses()
				? this.cachedDamageMelee
				: this.cachedDamageRanged,
			false
		]
	}

	protected UpdateSpecialValues() {
		const name = "item_quelling_blade"
		this.cachedDamageMelee = this.GetSpecialValue("damage_bonus", name)
		this.cachedDamageRanged = this.GetSpecialValue("damage_bonus_ranged", name)
	}
}
