import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("chaos_knight_chaos_bolt")
export class chaos_knight_chaos_bolt extends Ability {
	public readonly ProjectilePath =
		"particles/units/heroes/hero_chaos_knight/chaos_knight_chaos_bolt.vpcf"
}
