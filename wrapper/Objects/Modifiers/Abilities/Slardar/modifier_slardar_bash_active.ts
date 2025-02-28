import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_slardar_bash_active extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedBonusDamage = 0
	private cachedAttackCount = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.StackCount < this.cachedAttackCount) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding || target.IsCreep) {
			return [0, false]
		}
		return [this.cachedBonusDamage, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		const name = "slardar_bash"
		this.cachedBonusDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedAttackCount = this.GetSpecialValue("attack_count", name)
	}
}
