import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("abyssal_underlord_portal_warp")
export class abyssal_underlord_portal_warp extends Ability {
	constructor(index: number, serial: number, name: string) {
		super(index, serial, name)
		this.IsEmpty = true
	}

	public get ShouldBeDrawable(): boolean {
		return false
	}
}
