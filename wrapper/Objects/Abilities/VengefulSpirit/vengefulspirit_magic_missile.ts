import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("vengefulspirit_magic_missile")
export class vengefulspirit_magic_missile extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("magic_missile_speed", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("magic_missile_damage", level)
	}
}
