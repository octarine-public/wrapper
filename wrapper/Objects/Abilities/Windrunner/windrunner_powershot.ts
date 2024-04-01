import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("windrunner_powershot")
export class windrunner_powershot extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("arrow_width", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("powershot_damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("arrow_speed", level)
	}
}
