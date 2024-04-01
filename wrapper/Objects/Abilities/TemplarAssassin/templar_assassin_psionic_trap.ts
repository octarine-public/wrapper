import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("templar_assassin_psionic_trap")
export class templar_assassin_psionic_trap extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("trap_radius", level)
	}
}
