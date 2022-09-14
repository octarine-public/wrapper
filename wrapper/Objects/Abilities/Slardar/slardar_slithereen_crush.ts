import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("slardar_slithereen_crush")
export class slardar_slithereen_crush extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("crush_radius", level)
	}
}
