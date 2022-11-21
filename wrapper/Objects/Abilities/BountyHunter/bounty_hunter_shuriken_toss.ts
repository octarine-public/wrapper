import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bounty_hunter_shuriken_toss")
export class bounty_hunter_shuriken_toss extends Ability {
	public readonly ProjectilePath =
		"particles/units/heroes/hero_bounty_hunter/bounty_hunter_shuriken_dummy.vpcf"
}
