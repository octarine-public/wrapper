import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("terrorblade_reflection")
export class terrorblade_reflection extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("range", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
