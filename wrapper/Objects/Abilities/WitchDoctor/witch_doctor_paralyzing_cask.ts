import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("witch_doctor_paralyzing_cask")
export default class witch_doctor_paralyzing_cask extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_witchdoctor/witchdoctor_cask.vpcf"
}
