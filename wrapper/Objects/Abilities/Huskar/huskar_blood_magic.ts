import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_Huskar_Blood_Magic")
export class huskar_blood_magic extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
