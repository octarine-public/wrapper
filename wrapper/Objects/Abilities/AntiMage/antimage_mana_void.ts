import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("antimage_mana_void")
export default class antimage_mana_void extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("mana_void_aoe_radius")
	}
}
