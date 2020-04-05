import Ability from "../../Base/Ability"

export default class invoker_ghost_walk extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_ghost_walk", invoker_ghost_walk)
