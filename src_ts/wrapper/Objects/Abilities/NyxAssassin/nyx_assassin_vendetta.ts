import Ability from "../../Base/Ability"

export default class nyx_assassin_vendetta extends Ability {
	public get IsInvisibilityType() {
		return true
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nyx_assassin_vendetta", nyx_assassin_vendetta)
