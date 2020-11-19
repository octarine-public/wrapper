import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("warlock_rain_of_chaos")
export default class warlock_rain_of_chaos extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("aoe")
	}
}
