import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_Centaur_Work_Horse")
export class centaur_work_horse extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
