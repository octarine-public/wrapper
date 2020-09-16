import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("earthshaker_echo_slam")
export default class earthshaker_echo_slam extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("echo_slam_damage_range")
	}
}
