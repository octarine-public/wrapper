import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("dark_willow_bedlam")
export default class dark_willow_bedlam extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("attack_radius")
	}
}
