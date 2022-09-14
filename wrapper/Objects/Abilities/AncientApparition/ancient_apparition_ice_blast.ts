import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ancient_apparition_ice_blast")
export class ancient_apparition_ice_blast extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("path_radius", level)
	}
}
