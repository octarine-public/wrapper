import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("arc_warden_spark_wraith")
export class arc_warden_spark_wraith extends Ability {
	public readonly ProjectilePath =
		"particles/units/heroes/hero_arc_warden/arc_warden_wraith_prj.vpcf"
}
