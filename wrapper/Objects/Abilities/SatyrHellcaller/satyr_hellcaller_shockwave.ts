import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("satyr_hellcaller_shockwave")
export class satyr_hellcaller_shockwave extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("radius_end")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius_start", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
