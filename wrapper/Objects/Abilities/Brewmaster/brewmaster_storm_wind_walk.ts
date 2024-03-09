import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("brewmaster_storm_wind_walk")
export class brewmaster_storm_wind_walk extends Ability {
	public get IsInvisibility(): boolean {
		return true
	}
}
