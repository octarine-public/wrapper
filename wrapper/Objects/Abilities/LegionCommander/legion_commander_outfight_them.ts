import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("legion_commander_outfight_them")
export class legion_commander_outfight_them extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
