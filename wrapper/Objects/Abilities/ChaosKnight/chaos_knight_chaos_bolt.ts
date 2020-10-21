import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("chaos_knight_chaos_bolt")
export default class chaos_knight_chaos_bolt extends Ability {
	public get ProjectileName() {
		return ["particles/units/heroes/hero_chaos_knight/chaos_knight_chaos_bolt.vpcf"]
	}
}
