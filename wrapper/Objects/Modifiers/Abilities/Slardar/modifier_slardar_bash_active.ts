import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_slardar_bash_active extends Modifier {
	private cachedBonusDamage = 0
	private cachedAttackCount = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.StackCount < this.cachedAttackCount) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding) {
			return [0, false]
		}
		let damage = this.cachedBonusDamage
		if (target.IsCreep) {
			damage *= 2 // no special value (harcoded by Valve)
		}
		return [damage, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		const name = "slardar_bash"
		this.cachedBonusDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedAttackCount = this.GetSpecialValue("attack_count", name)
	}
}
