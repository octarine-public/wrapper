import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tusk_ice_shards")
export class tusk_ice_shards extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("shard_width", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("shard_damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("shard_speed", level)
	}
}
