import { WrapperClass } from "../../../Decorators"
import { ExecuteOrder } from "../../../Native/ExecuteOrder"
import { Ability } from "../../Base/Ability"

@WrapperClass("pugna_nether_ward")
export class pugna_nether_ward extends Ability {
	public IsDoubleTap(order: ExecuteOrder): boolean {
		const doubletapTarget = this.Owner?.InFront(this.CastRange)
		return (
			doubletapTarget !== undefined &&
			order.Position.Distance2D(doubletapTarget) < 32
		)
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
