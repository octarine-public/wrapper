import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ringmaster_wheel")
export class ringmaster_wheel extends Ability {
	public get MinRange(): number {
		return this.GetSpecialValue("min_range")
	}
	public get VisionCone(): number {
		// value = 0.08715, 85 degree cone
		return this.GetSpecialValue("vision_cone")
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("trap_duration", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("mesmerize_radius", level)
	}
}
