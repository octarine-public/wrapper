import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_eul_cyclone extends Modifier {
	public readonly BonusMoveSpeedStack = true

	protected SetBonusMoveSpeed(specialName = "bonus_movement_speed"): void {
		super.SetBonusMoveSpeed(specialName)
	}
}
