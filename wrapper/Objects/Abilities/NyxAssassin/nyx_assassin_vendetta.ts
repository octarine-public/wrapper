import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("nyx_assassin_vendetta")
export class nyx_assassin_vendetta extends Ability {
	public get IsInvisibility(): boolean {
		return true
	}
}
