import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_sniper_keen_scope extends Modifier {
	private cachedRangeStep = 0
	private cachedDamagePerRange = 0

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
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || this.cachedRangeStep <= 0) {
			return [0, false]
		}
		const bonusPct =
			this.cachedDamagePerRange * (owner.Distance2D(target) / this.cachedRangeStep)
		if (bonusPct <= 0) {
			return [0, false]
		}
		return [((params.RawDamageBase ?? 0) * bonusPct) / 100, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "sniper_keen_scope"
		this.cachedDamagePerRange = this.GetSpecialValue("bonus_damage_for_range", name)
		this.cachedRangeStep = this.GetSpecialValue("bonus_damage_distance", name)
	}
}
