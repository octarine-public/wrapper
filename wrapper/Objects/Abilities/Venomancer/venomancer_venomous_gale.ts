import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("venomancer_venomous_gale")
export class venomancer_venomous_gale extends Ability implements INuke {
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("strike_damage", level)
	}
}
