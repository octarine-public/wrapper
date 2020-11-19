import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("sven_warcry")
export default class sven_warcry extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("warcry_radius")
	}
}
