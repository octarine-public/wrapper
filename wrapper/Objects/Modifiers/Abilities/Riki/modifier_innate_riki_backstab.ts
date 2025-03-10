import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_innate_riki_backstab extends Modifier {
	public CachedMulDamage = 0
	private cachedBackstabAngle = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	public GetAttackBonusDamage(
		caster: Unit,
		target: Unit,
		withoutCalculation: boolean = false
	): number {
		if (target.IsBuilding || !target.IsEnemy(caster)) {
			return 0
		}
		const value = this.CachedMulDamage * caster.TotalAgility
		if (withoutCalculation) {
			return value
		}
		const angle = -target.GetSourceAngleToForward(caster, false, target.Position)
		return angle > Math.cos(this.cachedBackstabAngle) ? value : 0
	}

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined) {
			return [0, false]
		}
		return [this.GetAttackBonusDamage(owner, target), false]
	}

	protected UpdateSpecialValues(): void {
		const name = "riki_innate_backstab"
		this.CachedMulDamage = this.GetSpecialValue("damage_multiplier", name)
		this.cachedBackstabAngle = Math.degreesToRadian(
			this.GetSpecialValue("backstab_angle", name)
		)
	}
}
