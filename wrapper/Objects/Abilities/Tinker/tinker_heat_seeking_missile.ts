import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tinker_heat_seeking_missile")
export class tinker_heat_seeking_missile extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}
