import Ability from "../../Base/Ability"

export default class juggernaut_omni_slash extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("omni_slash_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("juggernaut_omni_slash", juggernaut_omni_slash)
