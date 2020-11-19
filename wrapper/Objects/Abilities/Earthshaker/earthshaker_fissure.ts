import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("earthshaker_fissure")
export default class earthshaker_fissure extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("fissure_radius")
	}
}
