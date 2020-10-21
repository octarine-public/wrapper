import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("vengefulspirit_magic_missile")
export default class vengefulspirit_magic_missile extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("magic_missile_speed")
	}
	public get ProjectileName() {
		return []
	}
}
