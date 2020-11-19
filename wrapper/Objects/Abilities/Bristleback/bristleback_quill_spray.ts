import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("bristleback_quill_spray")
export default class bristleback_quill_spray extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
