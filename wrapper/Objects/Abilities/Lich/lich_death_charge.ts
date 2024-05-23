import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lich_death_charge")
export class lich_death_charge extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
