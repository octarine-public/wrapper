import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("crystal_maiden_freezing_field")
export class crystal_maiden_freezing_field extends Ability {
	public ExplosionRadius(): number {
		return this.GetSpecialValue("explosion_radius")
	}
}
