import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("nevermore_requiem")
export default class nevermore_requiem extends Ability {
	public get AOERadius() {
		return this.GetSpecialValue("requiem_radius")
	}
}
