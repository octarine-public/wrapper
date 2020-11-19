import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("bristleback_viscous_nasal_goo")
export default class bristleback_viscous_nasal_goo extends Ability {
	public get AOERadius(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("radius_scepter")
			: 0
	}
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_bristleback/bristleback_viscous_nasal_goo.vpcf",
			"particles/econ/items/bristleback/ti7_head_nasal_goo/bristleback_ti7_nasal_goo_proj.vpcf",
			"particles/econ/items/bristleback/ti7_head_nasal_goo/bristleback_ti7_crimson_nasal_goo_proj.vpcf",
		]
	}
}
