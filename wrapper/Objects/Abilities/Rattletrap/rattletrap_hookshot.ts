import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("rattletrap_hookshot")
export default class rattletrap_hookshot extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("latch_radius")
	}
}
