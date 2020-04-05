import Ability from "../../Base/Ability"

export default class chen_hand_of_god extends Ability {

	public get AOERadius(): number {
		return Number.MAX_SAFE_INTEGER
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("chen_hand_of_god", chen_hand_of_god)
