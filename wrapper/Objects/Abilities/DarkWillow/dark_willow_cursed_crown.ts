import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("dark_willow_cursed_crown")
export default class dark_willow_cursed_crown extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("stun_radius")
	}
}
