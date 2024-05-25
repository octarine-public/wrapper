import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("skeleton_king_reincarnation")
export class skeleton_king_reincarnation extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("slow_radius", level)
	}
}
