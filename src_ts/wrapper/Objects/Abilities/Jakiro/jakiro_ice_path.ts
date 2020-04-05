import Ability from "../../Base/Ability"

export default class jakiro_ice_path extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("path_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("jakiro_ice_path", jakiro_ice_path)
