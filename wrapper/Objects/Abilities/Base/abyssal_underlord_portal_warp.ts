import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("abyssal_underlord_portal_warp")
export class abyssal_underlord_portal_warp extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
