import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("dazzle_shallow_grave")
export default class dazzle_shallow_grave extends Ability {
	public get AOERadius(): number {
		return super.Owner?.HasScepter
			? this.GetSpecialValue("scepter_radius")
			: 0
	}
}
