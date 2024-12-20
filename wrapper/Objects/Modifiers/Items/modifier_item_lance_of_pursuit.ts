import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_lance_of_pursuit extends Modifier {
	private cachedDamage = 0
	private cachedBackstabAngle = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined) {
			return [0, false]
		}
		return [this.getAttackBonusDamage(owner, target), false]
	}

	protected UpdateSpecialValues(): void {
		const name = "item_lance_of_pursuit"
		this.cachedDamage = this.GetSpecialValue("backstab_damage", name)
		this.cachedBackstabAngle = Math.degreesToRadian(
			this.GetSpecialValue("backstab_angle", name)
		)
	}

	private getAttackBonusDamage(caster: Unit, target: Unit): number {
		if (target.IsBuilding || !target.IsEnemy(caster)) {
			return 0
		}
		const angle = -target.GetSourceAngleToForward(caster, false, target.Position)
		return angle > Math.cos(this.cachedBackstabAngle) ? this.cachedDamage : 0
	}
}
