import { WrapperClass } from "../../../Decorators"
import { ExecuteOrder } from "../../../Native/ExecuteOrder"
import { Ability } from "../../Base/Ability"

@WrapperClass("earth_spirit_stone_caller")
export class earth_spirit_stone_caller extends Ability {
	public IsDoubleTap(order: ExecuteOrder): boolean {
		const doubletapTarget = this.Owner?.InFront(120)
		return (
			doubletapTarget !== undefined &&
			order.Position.Distance2D(doubletapTarget) < 32
		)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxChargesForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCharges", level)
	}
}
