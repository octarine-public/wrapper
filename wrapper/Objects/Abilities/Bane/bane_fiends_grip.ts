import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bane_fiends_grip")
export class bane_fiends_grip extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("fiend_grip_damage", level)
	}
}
