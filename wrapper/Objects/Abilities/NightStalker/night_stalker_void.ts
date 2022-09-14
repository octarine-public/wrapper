import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("night_stalker_void")
export class night_stalker_void extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("radius_scepter", level)
			: 0
	}
}
