import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("dark_willow_bedlam")
export default class dark_willow_bedlam extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("attack_radius")
	}
}
