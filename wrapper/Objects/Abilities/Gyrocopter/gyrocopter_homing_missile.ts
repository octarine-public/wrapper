import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("gyrocopter_homing_missile")
export class gyrocopter_homing_missile extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("hit_damage", level)
	}
}
