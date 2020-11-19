import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("jakiro_liquid_fire")
export default class jakiro_liquid_fire extends Ability {
	public get ProjectileName() {
		return ["particles/units/heroes/hero_jakiro/jakiro_base_attack_fire.vpcf"]
	}
}
