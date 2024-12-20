import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_battlefury extends Modifier {
	private cachedDamage = 0
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
			return [this.cachedDamage, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsHero || target.IsBuilding) {
			return [this.cachedDamage, false]
		}
		const passiveDamage = this.HasMeleeAttacksBonuses()
			? this.cachedDamageMelee
			: this.cachedDamageRanged
		return [this.cachedDamage + passiveDamage, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_bfury"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedDamageMelee = this.GetSpecialValue("quelling_bonus", name)
		this.cachedDamageRanged = this.GetSpecialValue("quelling_bonus_ranged", name)
	}
}
