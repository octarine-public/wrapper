import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bloodseeker_thirst extends Modifier {
	public readonly IsLimitMoveSpeed = false

	protected SetMoveSpeedAmplifier(
		specialName = "bonus_movement_speed",
		_subtract = false
	): void {
		if (this.Parent === undefined || this.Parent.IsNoTeamMoveTo) {
			return
		}
		const min = this.GetSpecialValue("min_bonus_pct")
		const max = this.GetSpecialValue("max_bonus_pct")
		if (min === max) {
			return
		}
		const bonus = this.GetSpecialValue(specialName)
		this.BonusMoveSpeedAmplifier = (bonus * this.StackCount) / (min - max) / 100
	}
}
