import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_drow_ranger_frost_arrows extends Modifier {
	public CachedDamage = 0
	private cachedDamageStack = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	public BonusDamagePerStack(target: Unit): number {
		const modifier = target.GetBuffByName(
			"modifier_drow_ranger_frost_arrows_hypothermia"
		)
		return this.CachedDamage + this.cachedDamageStack * (modifier?.StackCount ?? 0)
	}

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const owner = this.Parent,
			ability = this.Ability,
			target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || owner === undefined || !target.IsEnemy(owner)) {
			return [0, false]
		}
		if (ability === undefined || owner.Mana < ability.ManaCost) {
			return [0, false]
		}
		return ability.IsAutoCastEnabled
			? [this.BonusDamagePerStack(target), false]
			: [0, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "drow_ranger_frost_arrows"
		this.CachedDamage = this.GetSpecialValue("damage", name)
		this.cachedDamageStack = this.GetSpecialValue(
			"shard_bonus_damage_per_stack",
			name
		)
	}
}
