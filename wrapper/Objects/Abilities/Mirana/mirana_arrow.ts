import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("mirana_arrow")
export class mirana_arrow extends Ability {
	public get Speed() {
		return this.GetSpecialValue("arrow_speed")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("arrow_width", level)
	}
}
