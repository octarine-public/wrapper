import Ability from "../../Base/Ability"

export default class templar_assassin_meld extends Ability {
	public get IsInvisibilityType() {
		return true
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("templar_assassin_meld", templar_assassin_meld)
