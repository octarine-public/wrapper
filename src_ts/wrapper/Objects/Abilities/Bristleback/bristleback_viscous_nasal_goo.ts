import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("bristleback_viscous_nasal_goo")
export default class bristleback_viscous_nasal_goo extends Ability {
	public get AOERadius(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("radius_scepter")
			: 0
	}
}
