import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sand_king_epicenter_slow extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(
		specialName = "epicenter_slow_as",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
