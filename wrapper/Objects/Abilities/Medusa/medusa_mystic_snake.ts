import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("medusa_mystic_snake")
export class medusa_mystic_snake extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_medusa/medusa_mystic_snake_projectile_initial.vpcf"
}
