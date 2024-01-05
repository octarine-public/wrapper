import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dazzle_shallow_grave")
export class dazzle_shallow_grave extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("scepter_radius", level) : 0
	}
}
