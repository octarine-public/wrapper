import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_chemical_rage extends Modifier {
	public readonly IsBuff = true

	public SetBonusMoveSpeed(specialName = "bonus_movespeed", subtract = false): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
