import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_silencer_glaives_of_wisdom extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetPreAttackBonusDamageMagical.bind(this)
		]
	])

	protected GetPreAttackBonusDamageMagical(
		params?: IModifierParams
	): [number, boolean] {
		const owner = this.Parent,
			ability = this.Ability
		if (params === undefined || owner === undefined || ability === undefined) {
			return [0, false]
		}
		if (!ability.IsAutoCastEnabled || owner.Mana < ability.ManaCost) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding || !target.IsEnemy(this.Parent)) {
			return [0, false]
		}
		return [(owner.TotalIntellect * this.cachedDamage) / 100, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"intellect_damage_pct",
			"silencer_glaives_of_wisdom"
		)
	}
}
