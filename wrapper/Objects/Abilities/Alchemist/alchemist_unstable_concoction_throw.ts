import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("alchemist_unstable_concoction_throw")
export class alchemist_unstable_concoction_throw extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("midair_explosion_radius", level)
	}
}
