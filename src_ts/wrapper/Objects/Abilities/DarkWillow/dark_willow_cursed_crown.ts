import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("dark_willow_cursed_crown")
export default class dark_willow_cursed_crown extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("stun_radius")
	}
}
