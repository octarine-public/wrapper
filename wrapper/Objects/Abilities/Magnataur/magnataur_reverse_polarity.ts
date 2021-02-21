import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("magnataur_reverse_polarity")
export default class magnataur_reverse_polarity extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("pull_radius")
	}

}
