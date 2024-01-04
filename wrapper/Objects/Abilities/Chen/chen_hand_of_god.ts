import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("chen_hand_of_god")
export class chen_hand_of_god extends Ability {
	public GetBaseAOERadiusForLevel(_level: number): number {
		return Number.MAX_SAFE_INTEGER
	}
}
