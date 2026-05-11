import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_viper_predator extends Modifier {
	private cachedBaseDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params?.SourceIndex)
		if (target === undefined || target.IsBuilding) {
			return [0, false]
		}
		if (target.IsCreep || !target.IsEnemy(owner)) {
			return [0, false]
		}
		return [(100 - target.HPPercent) * this.cachedBaseDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedBaseDamage = this.GetSpecialValue(
			"damage",
			"viper_predator",
			Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
		)
	}
}
