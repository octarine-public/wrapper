import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("rattletrap_hookshot")
export default class rattletrap_hookshot extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("latch_radius")
	}
}
