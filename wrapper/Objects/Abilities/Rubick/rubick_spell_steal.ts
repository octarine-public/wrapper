import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("rubick_spell_steal")
export default class rubick_spell_steal extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
