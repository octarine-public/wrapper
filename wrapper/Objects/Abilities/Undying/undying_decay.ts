import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("undying_decay")
export default class undying_decay extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("decay_damage")
	}
}
