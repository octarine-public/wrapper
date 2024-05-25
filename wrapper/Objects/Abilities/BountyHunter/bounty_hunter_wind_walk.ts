import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bounty_hunter_wind_walk")
export class bounty_hunter_wind_walk extends Ability {
	public get IsInvisibility(): boolean {
		return true
	}
}
