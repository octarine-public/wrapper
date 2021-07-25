import { WrapperClass } from "../../../Decorators"
import ExecuteOrder from "../../../Native/ExecuteOrder"
import Ability from "../../Base/Ability"

@WrapperClass("pugna_nether_ward")
export default class pugna_nether_ward extends Ability {
	public IsDoubleTap(order: ExecuteOrder): boolean {
		const doubletap_target = this.Owner?.InFront(this.CastRange)
		return doubletap_target !== undefined && order.Position.Distance2D(doubletap_target) < 32
	}
}
