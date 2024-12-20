import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameActivity } from "../../../../Enums/GameActivity"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_juggernaut_blade_dance extends Modifier {
	private cachedCritDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CRITICAL_STRIKE_BONUS,
			this.GetCriticalStrikeBonus.bind(this)
		]
	])

	protected GetCriticalStrikeBonus(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || this.IsPassiveDisabled() || this.IsSuppressCrit()) {
			return [0, false]
		}
		// attack_crit_anim
		if (owner.NetworkActivity !== GameActivity.ACT_DOTA_ATTACK_EVENT) {
			return [0, false]
		}
		return [this.cachedCritDamage, false]
	}

	protected UpdateSpecialValues() {
		this.cachedCritDamage = this.GetSpecialValue(
			"blade_dance_crit_mult",
			"juggernaut_blade_dance"
		)
	}
}
