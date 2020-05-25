import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("drow_ranger_multishot")
export default class drow_ranger_multishot extends Ability {
	public get CastRange(): number {
		return (this.Owner?.AttackRange ?? 0) * this.GetSpecialValue("arrow_range_multiplier")
	}
}
