import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("arc_warden_flux")
export default class arc_warden_flux extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("search_radius")
	}
}
