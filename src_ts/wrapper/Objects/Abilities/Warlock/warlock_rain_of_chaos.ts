import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("warlock_rain_of_chaos")
export default class warlock_rain_of_chaos extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("aoe")
	}
}
