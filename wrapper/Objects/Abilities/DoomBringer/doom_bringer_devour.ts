import { WrapperClass } from "../../../Decorators"
import { DOTA_ABILITY_BEHAVIOR } from "../../../Enums/DOTA_ABILITY_BEHAVIOR"
import { dotaunitorder_t } from "../../../Enums/dotaunitorder_t"
import { ExecuteOrder } from "../../../Native/ExecuteOrder"
import { Ability } from "../../Base/Ability"

@WrapperClass("doom_bringer_devour")
export class doom_bringer_devour extends Ability {
	public SkippedHumanizer(order: ExecuteOrder) {
		return (
			order.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET &&
			this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)
		)
	}
}
