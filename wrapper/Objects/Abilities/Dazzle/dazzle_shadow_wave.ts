import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("dazzle_shadow_wave")
export default class dazzle_shadow_wave extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("damage_radius")
	}
}
