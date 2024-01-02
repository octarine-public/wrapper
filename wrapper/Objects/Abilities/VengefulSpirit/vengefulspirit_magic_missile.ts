import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("vengefulspirit_magic_missile")
export class vengefulspirit_magic_missile extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("magic_missile_speed")
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}
}
