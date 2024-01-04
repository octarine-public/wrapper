import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sven_warcry")
export class sven_warcry extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue(
			this.Owner?.HasShard ? "shard_radius" : "radius",
			level
		)
	}
}
