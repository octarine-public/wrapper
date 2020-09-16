import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("night_stalker_void")
export default class night_stalker_void extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("radius_scepter")
	}
}
