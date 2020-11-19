import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("templar_assassin_trap")
export default class templar_assassin_trap extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("trap_radius")
	}
}
