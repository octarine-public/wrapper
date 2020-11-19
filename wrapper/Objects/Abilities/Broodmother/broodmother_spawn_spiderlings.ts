import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("broodmother_spawn_spiderlings")
export default class broodmother_spawn_spiderlings extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get ProjectileName() {
		return ["particles/units/heroes/hero_broodmother/broodmother_web_cast.vpcf"]
	}
}
