import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("jakiro_liquid_fire")
export class jakiro_liquid_fire extends Ability {
	public readonly ProjectilePath =
		"particles/units/heroes/hero_jakiro/jakiro_base_attack_fire.vpcf"
}
