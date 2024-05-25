import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("puck_illusory_orb")
export class puck_illusory_orb extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("max_distance", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("orb_speed", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
