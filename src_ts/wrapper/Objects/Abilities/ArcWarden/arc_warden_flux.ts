import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("arc_warden_flux")
export default class arc_warden_flux extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("search_radius")
	}
}
