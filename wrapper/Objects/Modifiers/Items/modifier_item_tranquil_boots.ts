import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_tranquil_boots extends Modifier {
	public readonly IsBoots = true

	protected SetBonusMoveSpeed(specialName = "bonus_movement_speed"): void {
		if (this.Ability === undefined || this.Ability.Cooldown !== 0) {
			this.BonusMoveSpeed = 0
			return
		}
		super.SetBonusMoveSpeed(specialName)
	}
}
