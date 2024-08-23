import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ringmaster_impalement")
export class ringmaster_impalement extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("dagger_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("dagger_vision", level)
	}
}
