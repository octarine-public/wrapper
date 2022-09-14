import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("zuus_cloud")
export class zuus_cloud extends Ability {
	public GetBaseCastRangeForLevel(_level: number): number {
		return Number.MAX_SAFE_INTEGER
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("cloud_radius", level)
	}
}
