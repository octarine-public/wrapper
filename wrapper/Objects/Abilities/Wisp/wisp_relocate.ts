import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("wisp_relocate")
export class wisp_relocate extends Ability {
	public GetBaseChannelTimeForLevel(level: number): number {
		return this.GetSpecialValue("cast_delay", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("return_time", level)
	}
}
