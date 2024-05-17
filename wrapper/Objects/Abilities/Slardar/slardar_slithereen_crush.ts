import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("slardar_slithereen_crush")
export class slardar_slithereen_crush extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return (
			this.GetSpecialValue("crush_radius", level) +
			this.GetSpecialValue("shard_bonus_radius", level)
		)
	}
}
