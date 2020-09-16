import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("dark_seer_wall_of_replica")
export default class dark_seer_wall_of_replica extends Ability {
	public get AOERadius(): number {
		let width = this.GetSpecialValue("width")
		if (!this.Owner?.HasScepter)
			return width
		return width * this.GetSpecialValue("scepter_length_multiplier")
	}
}
