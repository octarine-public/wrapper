import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lich_sinister_gaze")
export class lich_sinister_gaze extends Ability {
	public GetBaseChannelTimeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityChannelTime", level)
	}
}
