import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_creep_siege extends Modifier {
	private cachedHeroPenalty = 0
	private cachedBasicPenalty = 0
	private cachedPreAttackDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_RAW_INCOMING_DAMAGE_PERCENTAGE,
			this.GetPreAttackRawIncomingDamagePercentage.bind(this)
		]
	])

	protected GetPreAttackBonusDamagePercentage(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || !target.HasBuffByName("modifier_creep_siege")) {
			return [0, false]
		}
		return [this.cachedPreAttackDamage, false]
	}

	protected GetPreAttackRawIncomingDamagePercentage(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.HasBuffByName("modifier_creep_siege")) {
			return [0, false]
		}
		return target.IsHero
			? [this.cachedHeroPenalty, false]
			: [this.cachedBasicPenalty, false]
	}

	protected UpdateSpecialValues() {
		const name = "creep_siege"
		this.cachedPreAttackDamage = this.GetSpecialValue("bonus_building_damage", name)
		this.cachedHeroPenalty = this.GetSpecialValue(
			"incoming_hero_damage_penalty",
			name
		)
		this.cachedBasicPenalty = this.GetSpecialValue(
			"incoming_basic_damage_penalty",
			name
		)
	}
}
