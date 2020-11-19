import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("rubick_spell_steal")
export default class rubick_spell_steal extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
