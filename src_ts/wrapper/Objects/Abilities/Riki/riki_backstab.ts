import Ability from "../../Base/Ability"

export default class riki_backstab extends Ability {
	public get IsInvisibilityType() {
		return true
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("riki_backstab", riki_backstab)
