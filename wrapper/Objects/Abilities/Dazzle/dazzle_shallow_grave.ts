import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("dazzle_shallow_grave")
export default class dazzle_shallow_grave extends Ability {
	public get AOERadius(): number {
		return super.Owner?.HasScepter
			? this.GetSpecialValue("scepter_radius")
			: 0
	}
}
