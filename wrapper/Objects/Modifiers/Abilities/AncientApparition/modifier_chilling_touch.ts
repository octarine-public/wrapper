import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_chilling_touch extends Modifier {
	private cachedRange = 0
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetPreAttackBonusDamageMagical.bind(this)
		]
	])

	protected GetAttackRangeBonus(): [number, boolean] {
		const isEnabled = this.Ability?.IsAutoCastEnabled ?? false,
			isReady = this.Ability?.IsReady ?? false
		return isEnabled && isReady ? [this.cachedRange, false] : [0, false]
	}

	protected GetPreAttackBonusDamageMagical(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const isEnabled = this.Ability?.IsAutoCastEnabled ?? false,
			isReady = this.Ability?.IsReady ?? false
		if (!isEnabled || !isReady) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding) {
			return [0, false]
		}
		if (!target.IsEnemy(this.Parent) || this.IsMagicImmune(target)) {
			return [0, false]
		}
		return [this.cachedDamage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "ancient_apparition_chilling_touch"
		this.cachedRange = this.GetSpecialValue("attack_range_bonus", name)
		this.cachedDamage = this.GetSpecialValue("damage", name)
	}
}
