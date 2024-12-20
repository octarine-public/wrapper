import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_obsidian_destroyer_arcane_orb extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE,
			this.GetPreAttackBonusDamagePure.bind(this)
		]
	])

	protected GetPreAttackBonusDamagePure(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent,
			ability = this.Ability
		if (params === undefined || owner === undefined || ability === undefined) {
			return [0, false]
		}
		const isReady = ability.IsReady,
			isEnabled = ability.IsAutoCastEnabled
		if (!isEnabled || !isReady) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding || !target.IsEnemy(this.Parent)) {
			return [0, false]
		}
		return [((owner.Mana - ability.ManaCost) * this.cachedDamage) / 100, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"mana_pool_damage_pct",
			"obsidian_destroyer_arcane_orb"
		)
	}
}
