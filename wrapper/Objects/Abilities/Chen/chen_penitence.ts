import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("chen_penitence")
export default class chen_penitence extends Ability {
	public get ProjectileName() {
		return ["particles/units/heroes/hero_chen/chen_penitence_proj.vpcf"]
	}
}
