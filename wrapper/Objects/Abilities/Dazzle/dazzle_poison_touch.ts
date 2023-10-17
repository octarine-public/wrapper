import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dazzle_poison_touch")
export class dazzle_poison_touch extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}
	public get Range(): number {
		return this.GetSpecialValue("end_distance")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("start_radius", level)
	}
}
