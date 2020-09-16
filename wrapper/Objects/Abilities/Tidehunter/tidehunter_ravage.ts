import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("tidehunter_ravage")
export default class tidehunter_ravage extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}
