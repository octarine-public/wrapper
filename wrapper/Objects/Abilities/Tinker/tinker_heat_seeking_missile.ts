import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("tinker_heat_seeking_missile")
export default class tinker_heat_seeking_missile extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_tinker/tinker_missile.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}
