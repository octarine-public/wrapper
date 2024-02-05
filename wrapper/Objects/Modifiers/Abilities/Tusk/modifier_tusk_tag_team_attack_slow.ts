import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tusk_tag_team_attack_slow extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "attack_speed_slow",
		subtract = true
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
