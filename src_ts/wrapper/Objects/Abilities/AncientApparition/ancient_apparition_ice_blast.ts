import Ability from "../../Base/Ability"

export default class ancient_apparition_ice_blast extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("path_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ancient_apparition_ice_blast", ancient_apparition_ice_blast)
