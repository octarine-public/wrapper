import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("medusa_mystic_snake")
export default class medusa_mystic_snake extends Ability {
	public get ProjectileName() {
		return ["particles/units/heroes/hero_medusa/medusa_mystic_snake_projectile_initial.vpcf"]
	}
}
