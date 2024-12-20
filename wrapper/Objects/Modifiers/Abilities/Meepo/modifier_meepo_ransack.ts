import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_meepo_ransack extends Modifier {
	private cachedDamageHero = 0
	private cachedDamageCreep = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE,
			this.GetPreAttackBonusDamagePure.bind(this)
		]
	])

	protected GetPreAttackBonusDamagePure(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding || this.IsPassiveDisabled()) {
			return [0, false]
		}
		if (target.IsHero) {
			return [this.cachedDamageHero, false]
		}
		if (target.IsCreep) {
			return [this.cachedDamageCreep, false]
		}
		return [0, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "meepo_ransack"
		this.cachedDamageHero = this.GetSpecialValue("health_steal_heroes", name)
		this.cachedDamageCreep = this.GetSpecialValue("health_steal_creeps", name)
	}
}
