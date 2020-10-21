import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("bounty_hunter_shuriken_toss")
export default class bounty_hunter_shuriken_toss extends Ability {
	public get ProjectileName() {
		return []
	}
}
