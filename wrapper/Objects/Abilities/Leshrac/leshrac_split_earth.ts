import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("leshrac_split_earth")
export class leshrac_split_earth extends Ability {
	public get ShardMaxCount() {
		return this.GetSpecialValue("shard_max_count")
	}
	public get ShardRadiusIncrease() {
		return this.GetSpecialValue("shard_radius_increase")
	}
	public get ShardSecondaryDelay() {
		return this.GetSpecialValue("shard_secondary_delay")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}
}
