import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("wisp_essence_conduction")
export class wisp_essence_conduction extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
