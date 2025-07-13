import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tiny_tree_grab")
export class tiny_tree_grab extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("splash_width", level)
	}
}
