import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_smoke_of_deceit extends Modifier {
	protected readonly CustomAbilityName = "item_smoke_of_deceit"

	protected SetMoveSpeedAmplifier(
		specialName = "bonus_movement_speed",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
