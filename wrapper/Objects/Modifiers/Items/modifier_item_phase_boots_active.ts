import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_phase_boots_active extends Modifier {
	public readonly IsBuff = true

	protected SetFixedBaseTurnRate(_specialName?: string, _subtract = false) {
		// no data https://dota2.fandom.com/wiki/Phase_Boots
		this.FixedBaseTurnRate = this.IsRanged ? 0 : 1
	}

	protected SetMoveSpeedAmplifier(_specialName?: string, subtract = false): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const specialName = `phase_movement_speed${owner.IsRanged ? "_range" : ""}`
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
