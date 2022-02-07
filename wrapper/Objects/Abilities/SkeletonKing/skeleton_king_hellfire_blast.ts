import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("skeleton_king_hellfire_blast")
export default class skeleton_king_hellfire_blast extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_skeletonking/skeletonking_hellfireblast.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("blast_speed")
	}
}
