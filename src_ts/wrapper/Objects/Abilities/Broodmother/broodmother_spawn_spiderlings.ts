import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("broodmother_spawn_spiderlings")
export default class broodmother_spawn_spiderlings extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
