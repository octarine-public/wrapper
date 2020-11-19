import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("drow_ranger_multishot")
export default class drow_ranger_multishot extends Ability {
	public get CastRange(): number {
		return (this.Owner?.AttackRange ?? 0) * this.GetSpecialValue("arrow_range_multiplier")
	}
}
