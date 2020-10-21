import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("oracle_fortunes_end")
export default class oracle_fortunes_end extends Ability {
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_oracle/oracle_fortune_prj.vpcf",
			"particles/econ/items/oracle/oracle_fortune_ti7/oracle_fortune_ti7_proj.vpcf"
		]
	}
}
