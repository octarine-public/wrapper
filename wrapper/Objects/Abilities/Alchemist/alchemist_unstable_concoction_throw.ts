import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("alchemist_unstable_concoction_throw")
export default class alchemist_unstable_concoction_throw extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_alchemist/alchemist_unstable_concoction_projectile.vpcf"
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("midair_explosion_radius", level)
	}
}
