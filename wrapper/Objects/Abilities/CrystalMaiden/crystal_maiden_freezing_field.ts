import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("crystal_maiden_freezing_field")
export default class crystal_maiden_freezing_field extends Ability {
	public ExplosionRadius(): number {
		return this.GetSpecialValue("explosion_radius")
	}
}
