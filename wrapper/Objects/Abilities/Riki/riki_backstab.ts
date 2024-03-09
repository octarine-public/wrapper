import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("riki_backstab")
export class riki_backstab extends Ability {
	public get IsInvisibility(): boolean {
		return true
	}
}
