import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("shredder_reactive_armor")
export class shredder_reactive_armor extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}

	public GetBaseManaCostForLevel(level: number): number {
		return this.GetSpecialValue("AbilityManaCost", level)
	}
}
