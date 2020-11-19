import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("tinker_laser")
export default class tinker_laser extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("laser_damage")
	}
}
