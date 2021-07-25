import { WrapperClass } from "../../../Decorators"
import ExecuteOrder from "../../../Native/ExecuteOrder"
import Ability from "../../Base/Ability"

@WrapperClass("earth_spirit_stone_caller")
export default class earth_spirit_stone_caller extends Ability {
	public IsDoubleTap(order: ExecuteOrder): boolean {
		const doubletap_target = this.Owner?.InFront(120)
		return doubletap_target !== undefined && order.Position.Distance2D(doubletap_target) < 32
	}
}
