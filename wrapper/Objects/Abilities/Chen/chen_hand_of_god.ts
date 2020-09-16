import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("chen_hand_of_god")
export default class chen_hand_of_god extends Ability {
	public get AOERadius(): number {
		return Number.MAX_SAFE_INTEGER
	}
}
