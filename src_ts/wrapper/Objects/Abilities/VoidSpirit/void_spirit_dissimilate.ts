import Ability from "../../Base/Ability"

export default class void_spirit_dissimilate extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("first_ring_distance_offset") * 1.5
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("void_spirit_dissimilate", void_spirit_dissimilate)
