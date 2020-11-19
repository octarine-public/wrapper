import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("dazzle_shadow_wave")
export default class dazzle_shadow_wave extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("damage_radius")
	}
}
