import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("arc_warden_spark_wraith")
export default class arc_warden_spark_wraith extends Ability {
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_arc_warden/arc_warden_wraith_prj.vpcf",
			"particles/econ/items/arc_warden/arc_warden_ti9_immortal/arc_warden_ti9_wraith_prj.vpcf"
		]
	}
}
