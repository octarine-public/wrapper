import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("drow_ranger_trueshot")
export class drow_ranger_trueshot extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
