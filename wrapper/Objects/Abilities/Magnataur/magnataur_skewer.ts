import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("magnataur_skewer")
export default class magnataur_skewer extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("skewer_radius")
	}

	public get Speed(): number {
		return this.GetSpecialValue("skewer_speed")
	}
}
