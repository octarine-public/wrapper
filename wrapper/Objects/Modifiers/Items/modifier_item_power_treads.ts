import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_power_treads extends Modifier {
	public readonly IsBoots = true

	protected SetBonusMoveSpeed(_specialName?: string): void {
		super.SetBonusMoveSpeed(
			`${this.Parent?.IsRanged}`
				? "bonus_movement_speed_ranged"
				: "bonus_movement_speed_melee"
		)
	}
}
