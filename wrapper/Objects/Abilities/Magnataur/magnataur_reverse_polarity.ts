import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("magnataur_reverse_polarity")
export class magnataur_reverse_polarity extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("pull_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("polarity_damage", level)
	}
}
