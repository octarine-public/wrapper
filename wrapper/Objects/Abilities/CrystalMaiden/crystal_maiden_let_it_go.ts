import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("crystal_maiden_let_it_go")
export class crystal_maiden_let_it_go extends Ability {
	public GetBaseCastPointForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastPoint", level)
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}

	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}

	public GetBaseManaCostForLevel(level: number): number {
		return this.GetSpecialValue("AbilityManaCost", level)
	}
}
