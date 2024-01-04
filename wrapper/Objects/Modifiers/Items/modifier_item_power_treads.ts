import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_power_treads extends Modifier {
	public readonly IsBoots = true

	protected SetBonusMoveSpeed(_specialName?: string, _subtract?: boolean): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const specialName = `bonus_movement_speed_${owner.IsRanged ? "ranged" : "melee"}`
		super.SetBonusMoveSpeed(specialName)
	}
}
