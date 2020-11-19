import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("dragon_knight_dragon_tail")
export default class dragon_knight_dragon_tail extends Ability {
	public get ProjectileName() {
		return ["particles/units/heroes/hero_dragon_knight/dragon_knight_dragon_tail_dragonform_proj.vpcf"]
	}
}
