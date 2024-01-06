import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spirit_breaker_charge_of_darkness extends Modifier {
	public readonly IsLimitMoveSpeed = false
	public readonly IsVisibleForEnemies = true

	protected SetBonusMoveSpeed(specialName = "movement_speed"): void {
		super.SetBonusMoveSpeed(specialName)
	}
}
