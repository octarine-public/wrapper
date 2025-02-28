import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_misericorde extends Modifier {
	private cachedDamage = 0
	private cachedMissHP = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || params.RawDamageBase === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding) {
			return [0, false]
		}
		return [this.calculateDamage(target.HP, target.MaxHP), false]
	}

	protected UpdateSpecialValues() {
		const name = "item_misericorde"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedMissHP = this.GetSpecialValue("missing_hp", name)
	}

	private calculateDamage(hp: number, maxHP: number): number {
		return ((((maxHP - hp) / maxHP) * 100) / this.cachedMissHP) * this.cachedDamage
	}
}
