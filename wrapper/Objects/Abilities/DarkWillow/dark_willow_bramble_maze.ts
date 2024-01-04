import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dark_willow_bramble_maze")
export class dark_willow_bramble_maze extends Ability {
	public get ActivationDelay() {
		return (
			this.GetSpecialValue("initial_creation_delay") +
			this.GetSpecialValue("latch_creation_delay")
		)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("placement_range", level)
	}
}
