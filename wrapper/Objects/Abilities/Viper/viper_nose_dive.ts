import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_Viper_Nose_Dive")
export class viper_nose_dive extends Ability {
	public get StartHeight() {
		return this.GetSpecialValue("start_height")
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("dive_speed", level)
	}
}
