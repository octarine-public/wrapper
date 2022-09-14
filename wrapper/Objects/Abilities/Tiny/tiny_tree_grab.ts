import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tiny_tree_grab")
export class tiny_tree_grab extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_tiny/tiny_tree_proj.vpcf"
}
