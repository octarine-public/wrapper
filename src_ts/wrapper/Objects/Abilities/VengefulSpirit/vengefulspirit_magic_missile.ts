import Ability from "../../Base/Ability"

export default class vengefulspirit_magic_missile extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("magic_missile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("vengefulspirit_magic_missile", vengefulspirit_magic_missile)
