import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("witch_doctor_paralyzing_cask")
export default class witch_doctor_paralyzing_cask extends Ability {
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_witchdoctor/witchdoctor_cask.vpcf",
			"particles/econ/items/witch_doctor/wd_monkey/witchdoctor_cask_monkey.vpcf",
			"particles/econ/items/witch_doctor/wd_ti8_immortal_bonkers/wd_ti8_immortal_bonkers_cask.vpcf"
		]
	}
}
