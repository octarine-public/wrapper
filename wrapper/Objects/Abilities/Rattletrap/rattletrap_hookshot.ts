import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("rattletrap_hookshot")
export default class rattletrap_hookshot extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("latch_radius", level)
	}
}
