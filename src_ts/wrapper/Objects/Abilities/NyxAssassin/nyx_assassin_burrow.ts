import Ability from "../../Base/Ability"

export default class nyx_assassin_burrow extends Ability {
	public get IsInvisibilityType() {
		return this.Owner?.HasScepter ?? false
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nyx_assassin_burrow", nyx_assassin_burrow)
