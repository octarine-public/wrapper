import Ability from "../../Base/Ability"

export default class faceless_void_time_walk extends Ability {
	public get BaseCastRange(): number {
		return this.GetSpecialValue("range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("faceless_void_time_walk", faceless_void_time_walk)
