import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("sven_warcry")
export default class sven_warcry extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("warcry_radius")
	}
}
