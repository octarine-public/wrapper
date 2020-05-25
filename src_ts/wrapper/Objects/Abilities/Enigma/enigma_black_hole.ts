import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("enigma_black_hole")
export default class enigma_black_hole extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("pull_radius")
	}
}
