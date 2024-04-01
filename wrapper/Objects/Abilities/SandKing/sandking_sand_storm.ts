import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sandking_sand_storm")
export class sandking_sand_storm extends Ability {
	public get IsInvisibility(): boolean {
		return true
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("sand_storm_radius", level)
	}
}
