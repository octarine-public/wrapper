import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("earthshaker_fissure")
export default class earthshaker_fissure extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("fissure_radius")
	}
}
