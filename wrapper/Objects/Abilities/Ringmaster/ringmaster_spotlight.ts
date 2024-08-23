import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ringmaster_spotlight")
export class ringmaster_spotlight extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
