import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("void_spirit_astral_step")
export class void_spirit_astral_step extends Ability {
	public get Speed(): number {
		return Number.MAX_SAFE_INTEGER
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("max_travel_distance", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
