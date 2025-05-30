import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_omniknight_hammer_of_purity extends Modifier {
	private cachedBonusDamage = 0
	private cachedShareDamage = 0
	private cachedAttackRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE,
			this.GetPreAttackBonusDamagePure.bind(this)
		]
	])
	protected GetAttackRangeBonus(): [number, boolean] {
		const isEnabled = this.Ability?.IsAutoCastEnabled ?? false,
			isReady = this.Ability?.IsReady ?? false
		return isEnabled && isReady ? [this.cachedAttackRange, false] : [0, false]
	}
	protected GetPreAttackBonusDamagePure(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const owner = this.Parent,
			target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || owner === undefined) {
			return [0, false]
		}
		if (target.IsMagicImmune || target.IsDebuffImmune) {
			return [0, false]
		}
		const ability = this.Ability
		if (ability === undefined || !ability.IsAutoCastEnabled || !ability.IsReady) {
			return [0, false]
		}
		const baseDamage = this.cachedBonusDamage,
			shareDamage = this.cachedShareDamage
		const damage = baseDamage + (owner.AttackDamageMin * shareDamage) / 100
		return [damage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "omniknight_hammer_of_purity"
		this.cachedShareDamage = this.GetSpecialValue("base_damage", name)
		this.cachedBonusDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedAttackRange = this.GetSpecialValue("attack_range_bonus", name)
	}
}
