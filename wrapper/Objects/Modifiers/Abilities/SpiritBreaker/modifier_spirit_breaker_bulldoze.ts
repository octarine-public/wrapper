import { WrapperClassModifier } from "../../../../Decorators"
import { DAMAGE_TYPES } from "../../../../Enums/DAMAGE_TYPES"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spirit_breaker_bulldoze extends Modifier {
	public readonly AbsorbDamageType = DAMAGE_TYPES.DAMAGE_TYPE_ALL

	public Update(): void {
		super.Update()
		if (!this.IsShield) {
			this.IsShield = this.NetworkFadeTime !== 0
		}
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.IsShield = false
		return true
	}

	protected SetAbsorbDamage(_specialName?: string, _subtract = false) {
		this.AbsorbDamage = Math.max(this.NetworkFadeTime, 0)
	}

	protected SetMoveSpeedAmplifier(specialName = "movement_speed"): void {
		super.SetMoveSpeedAmplifier(specialName)
	}

	protected SetStatusResistanceAmplifier(
		specialName = "status_resistance",
		subtract = false
	) {
		super.SetStatusResistanceAmplifier(specialName, subtract)
	}
}
