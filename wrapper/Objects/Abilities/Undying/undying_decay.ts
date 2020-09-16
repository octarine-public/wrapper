import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("undying_decay")
export default class undying_decay extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("decay_damage")
	}
}
