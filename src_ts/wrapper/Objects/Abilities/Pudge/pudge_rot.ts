import Ability from "../../Base/Ability"

export default class pudge_rot extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("rot_radius")
	}

}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pudge_rot", pudge_rot)
