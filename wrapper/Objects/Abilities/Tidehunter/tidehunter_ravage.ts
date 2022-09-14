import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tidehunter_ravage")
export class tidehunter_ravage extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}
