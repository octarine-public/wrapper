import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("furion_sprout")
export class furion_sprout extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("vision_range", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("sprout_damage", level)
	}
}
