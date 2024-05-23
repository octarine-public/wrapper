import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_Mars_Dauntless")
export class mars_dauntless extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
