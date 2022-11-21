import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("broodmother_spawn_spiderlings")
export class broodmother_spawn_spiderlings extends Ability {
	public readonly ProjectilePath =
		"particles/units/heroes/hero_broodmother/broodmother_web_cast.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
