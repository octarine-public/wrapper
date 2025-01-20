import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameActivity } from "../../../../Enums/GameActivity"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_chaos_knight_chaos_strike extends Modifier {
	private cachedCritDamage = 0
	private cachedCreepMultiplier = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CRITICAL_STRIKE_BONUS,
			this.GetCriticalStrikeBonus.bind(this)
		]
	])

	protected GetCriticalStrikeBonus(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || params === undefined) {
			return [0, false]
		}
		if (this.IsPassiveDisabled() || this.IsSuppressCrit()) {
			return [0, false]
		}
		// attack_crit_anim
		if (owner.NetworkActivity !== GameActivity.ACT_DOTA_ATTACK_EVENT) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined) {
			return [0, false]
		}
		let baseCrit = this.cachedCritDamage
		if (target.IsCreep) {
			baseCrit *= this.cachedCreepMultiplier
		}
		return [baseCrit, false]
	}

	protected UpdateSpecialValues() {
		const name = "chaos_knight_chaos_strike"
		this.cachedCritDamage = this.GetSpecialValue("crit_min", name)
		this.cachedCreepMultiplier = this.GetSpecialValue("creep_multiplier", name)
	}
}
