import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_lina_crit_debuff extends Modifier {
	private cachedBonusCrit = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE,
			this.GetPreAttackTargetCriticalStrike.bind(this)
		]
	])

	protected GetPreAttackTargetCriticalStrike(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || source !== this.Caster) {
			return [0, false]
		}
		return [this.cachedBonusCrit, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedBonusCrit = this.GetSpecialValue(
			"target_crit_multiplier",
			"lina_fiery_soul"
		)
	}
}
