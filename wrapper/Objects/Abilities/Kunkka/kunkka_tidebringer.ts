import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("kunkka_tidebringer")
export default class kunkka_tidebringer extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("cleave_distance")
	}
}
