import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("enigma_black_hole")
export default class enigma_black_hole extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("pull_speed")
	}
}
