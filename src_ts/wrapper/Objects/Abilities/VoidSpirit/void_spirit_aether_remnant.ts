import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("void_spirit_aether_remnant")
export default class void_spirit_aether_remnant extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get ActivationDelay(): number {
		return this.GetSpecialValue("activation_delay")
	}
}
