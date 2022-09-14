import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("earthshaker_aftershock")
export class earthshaker_aftershock extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("aftershock_range", level)
	}
}
