import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("skeleton_king_hellfire_blast")
export default class skeleton_king_hellfire_blast extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("blast_speed")
	}
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_skeletonking/skeletonking_hellfireblast.vpcf",
			"particles/econ/items/wraith_king/wraith_king_arcana/wk_arc_wraithfireblast.vpcf",
			"particles/econ/items/wraith_king/wraith_king_arcana/wk_arc_wraithfireblast_style2.vpcf",
			"particles/econ/items/wraith_king/wraith_king_ti6_bracer/wraith_king_ti6_hellfireblast.vpcf"
		]
	}
}
