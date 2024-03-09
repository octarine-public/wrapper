import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("nyx_assassin_burrow")
export class nyx_assassin_burrow extends Ability {
	public get IsInvisibility(): boolean {
		return true
	}
}
