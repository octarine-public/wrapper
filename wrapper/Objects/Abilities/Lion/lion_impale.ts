import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lion_impale")
export class lion_impale extends Ability implements INuke {
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius + this.GetSpecialValue("length_buffer")
	}
	public get IsConeShaped() {
		return this.GetSpecialValue("cone_shaped") !== 0
	}
	public get EndRadius(): number {
		if (!this.IsConeShaped) {
			return super.EndRadius
		}
		// TODO
		const buffer = this.GetSpecialValue("length_buffer")
		const coneAngleDeg = 30, // no special value in the ability definition
			range = this.CastRange / 2 + this.AOERadius + buffer,
			halfAngleRad = Math.degreesToRadian(coneAngleDeg / 2)
		return 2 * range * Math.tan(halfAngleRad)
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("width", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
