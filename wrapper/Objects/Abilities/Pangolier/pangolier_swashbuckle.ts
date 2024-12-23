import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("pangolier_swashbuckle")
export class pangolier_swashbuckle extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("dash_range", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("start_radius", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("dash_speed", level)
	}
}
