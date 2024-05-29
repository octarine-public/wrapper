import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ember_spirit_flame_guard")
export class ember_spirit_flame_guard extends Ability {
	public get PassiveRadius(): number {
		return this.GetSpecialValue("passive_radius")
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("active_radius", level)
	}
}
