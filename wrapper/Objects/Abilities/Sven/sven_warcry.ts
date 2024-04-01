import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sven_warcry")
export class sven_warcry extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue(
			this.Owner?.HasShard ? "shard_radius" : "radius",
			level
		)
	}
}
