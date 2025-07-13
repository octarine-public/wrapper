import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dark_seer_wall_of_replica")
export class dark_seer_wall_of_replica extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		let width = this.GetSpecialValue("width", level)
		if (this.Owner?.HasScepter) {
			width *= this.GetSpecialValue("scepter_length_multiplier", level)
		}
		return width
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
}
