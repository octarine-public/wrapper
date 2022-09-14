import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("earthshaker_enchant_totem")
export class earthshaker_enchant_totem extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("aftershock_range", level)
	}
}
