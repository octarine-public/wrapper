import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("visage_soul_assumption")
export default class visage_soul_assumption extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_visage/visage_soul_assumption_bolt.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
}
