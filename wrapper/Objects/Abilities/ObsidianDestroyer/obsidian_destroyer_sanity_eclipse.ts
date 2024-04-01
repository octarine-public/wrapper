import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("obsidian_destroyer_sanity_eclipse")
export class obsidian_destroyer_sanity_eclipse extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
