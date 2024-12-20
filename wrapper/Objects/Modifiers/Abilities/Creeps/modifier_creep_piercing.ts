import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_creep_piercing extends Modifier {
	private cachedHeroPenalty = 0
	private cachedHeavyPenalty = 0
	private cachedPreAttackDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	protected GetPreAttackBonusDamagePercentage(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined) {
			return [0, false]
		}
		if (target.IsHero) {
			return [this.cachedHeroPenalty, false]
		}
		if (target.IsBuilding) {
			return [this.cachedHeavyPenalty, false]
		}
		return [this.cachedPreAttackDamage, false]
	}

	protected UpdateSpecialValues() {
		const name = "creep_piercing"
		this.cachedPreAttackDamage = this.GetSpecialValue("creep_damage_bonus", name)
		this.cachedHeroPenalty = this.GetSpecialValue("hero_damage_penalty", name)
		this.cachedHeavyPenalty = this.GetSpecialValue("heavy_damage_penalty", name)
	}
}
