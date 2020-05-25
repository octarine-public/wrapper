import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("kunkka_ghostship")
export default class kunkka_ghostship extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("ghostship_width")
	}
}
