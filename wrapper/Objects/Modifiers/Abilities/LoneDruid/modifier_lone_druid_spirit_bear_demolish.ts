import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_lone_druid_spirit_bear_demolish extends Modifier {
	private cachedbuildingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])
	protected GetPreAttackBonusDamagePercentage(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || !target.IsBuilding || !target.IsEnemy(this.Parent)) {
			return [0, false]
		}
		return [this.cachedbuildingDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedbuildingDamage = this.GetSpecialValue(
			"bonus_building_damage",
			"lone_druid_spirit_bear_demolish"
		)
	}
}
