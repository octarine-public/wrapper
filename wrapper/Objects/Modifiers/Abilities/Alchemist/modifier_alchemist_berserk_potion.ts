import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_berserk_potion extends Modifier {
	public readonly IsBuff = true

	public SetBonusMoveSpeed(specialName = "move_speed", subtract?: boolean): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
