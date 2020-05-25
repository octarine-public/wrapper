import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("death_prophet_exorcism")
export default class death_prophet_exorcism extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("spirit_speed")
	}
}
